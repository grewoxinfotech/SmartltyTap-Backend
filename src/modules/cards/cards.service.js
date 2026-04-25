const cardsRepository = require("./cards.repository");
const { AnalyticsEvent, Card } = require("../../models");
const fs = require("fs");
const csv = require("csv-parser");
const bcrypt = require("bcryptjs");

// Ultra-fast in-memory cache for NFC Redirect Engine
const redirectCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function createCard({ userId, cardUid }) {
  if (userId) {
    const { User } = require("../../models");
    const user = await User.findByPk(userId);
    if (!user) return { ok: false, status: 404, message: "Associated user not found" };
  }
  const card = await cardsRepository.createCardForUser(userId, cardUid);
  return { ok: true, data: card };
}

async function assignCard(cardUid, userId) {
  const { User } = require("../../models");
  const user = await User.findByPk(userId);
  if (!user) return { ok: false, status: 404, message: "Target user not found" };

  const card = await Card.findOne({ where: { card_uid: cardUid } });
  if (!card) return { ok: false, status: 404, message: "Card not found" };
  
  await card.update({ user_id: userId, is_active: true });
  redirectCache.delete(cardUid);
  return { ok: true, data: { cardUid, userId } };
}

function generateTemporaryPassword() {
  const seed = Math.random().toString(36).slice(-6).toUpperCase();
  return `ST@${seed}#`;
}

async function sellCardWithBuyer({ cardUid, buyerName, buyerEmail, buyerPhone, businessType, templateId }) {
  const { User, Profile, Template } = require("../../models");

  const card = await Card.findOne({ where: { card_uid: cardUid } });
  if (!card) return { ok: false, status: 404, message: "Card not found" };
  if (card.user_id) return { ok: false, status: 409, message: "Card is already sold/assigned" };

  let user = await User.findOne({ where: { email: buyerEmail } });
  let temporaryPassword = null;

  if (!user) {
    temporaryPassword = generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);
    user = await User.create({
      name: buyerName,
      email: buyerEmail,
      password_hash: passwordHash,
      role: "USER",
      plan: "BASIC",
      is_active: true,
      reset_token: "FORCE_RESET",
      reset_token_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }

  if (templateId) {
    const template = await Template.findByPk(templateId);
    if (!template || !template.is_active) {
      return { ok: false, status: 400, message: "Selected template is invalid or inactive" };
    }

    const supported = template.layout_config?.businessTypes || template.layout_config?.business_types || [];
    if (businessType && Array.isArray(supported) && supported.length > 0) {
      const matched = supported.some((value) => String(value).toLowerCase() === String(businessType).toLowerCase());
      if (!matched) {
        return { ok: false, status: 400, message: "Selected template is not allowed for this business type" };
      }
    }
  }

  const existingProfile = await Profile.findOne({ where: { user_id: user.id } });
  if (existingProfile) {
    await existingProfile.update({
      name: buyerName || existingProfile.name,
      phone: buyerPhone || existingProfile.phone,
      title: businessType || existingProfile.title,
      ...(templateId ? { template: templateId } : {}),
    });
  } else {
    await Profile.create({
      user_id: user.id,
      name: buyerName,
      phone: buyerPhone || null,
      title: businessType || null,
      template: templateId || "template-01",
    });
  }

  await card.update({ user_id: user.id, is_active: true });
  redirectCache.delete(cardUid);

  return {
    ok: true,
    data: {
      cardUid,
      userId: user.id,
      buyer: { id: user.id, name: user.name, email: user.email },
      credentials: temporaryPassword ? { email: buyerEmail, temporaryPassword } : null,
      message: temporaryPassword
        ? "Card sold and new buyer credentials created"
        : "Card sold and linked to existing buyer account",
    },
  };
}

async function reassignCard(oldCardUid, newCardUid, userId) {
  const { User } = require("../../models");
  const oldCard = await Card.findOne({ where: { card_uid: oldCardUid } });
  if (!oldCard) return { ok: false, status: 404, message: "Old card not found" };

  const newCard = await Card.findOne({ where: { card_uid: newCardUid } });
  if (!newCard) return { ok: false, status: 404, message: "New card not found" };

  const targetUserId = userId || oldCard.user_id;
  if (!targetUserId) return { ok: false, status: 400, message: "User id is required for reassignment" };

  const user = await User.findByPk(targetUserId);
  if (!user) return { ok: false, status: 404, message: "Target user not found" };

  await oldCard.update({ is_active: false });
  await newCard.update({ user_id: targetUserId, is_active: true });
  redirectCache.delete(oldCardUid);
  redirectCache.delete(newCardUid);

  return { ok: true, data: { oldCardUid, newCardUid, userId: targetUserId } };
}

async function bulkUpload(filePath) {
  const results = [];
  
  return new Promise((resolve) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const cardsToInsert = results.map(row => ({
            card_uid: row.cardUid || row.card_uid || row.UID,
            user_id: row.userId || row.user_id || null,
            is_active: row.isActive === "true" || row.isActive === "1",
          })).filter(c => c.card_uid);

          if (cardsToInsert.length === 0) {
            resolve({ ok: false, status: 400, message: "No valid card_uid found in CSV" });
            return;
          }

          await Card.bulkCreate(cardsToInsert, { ignoreDuplicates: true });
          fs.unlinkSync(filePath); // Cleanup temp file
          resolve({ ok: true, data: { imported: cardsToInsert.length } });
        } catch (error) {
          console.error("Bulk upload error:", error);
          resolve({ ok: false, status: 500, message: "Database insertion failed" });
        }
      });
  });
}

async function getUserCards(userId) {
  const cards = await cardsRepository.listCardsByUser(userId);
  return { ok: true, data: cards };
}

async function setCardStatus(cardUid, isActive) {
  const count = await cardsRepository.updateCardStatus(cardUid, isActive);
  if (!count) return { ok: false, status: 404, message: "Card not found" };
  redirectCache.delete(cardUid); // Invalidate cache on status change
  return { ok: true, data: { cardUid, isActive } };
}

async function handleTap(cardUid, metadata = {}) {
  let payload;
  const cached = redirectCache.get(cardUid);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    payload = cached.data;
  } else {
    payload = await cardsRepository.findCardRedirectPayload(cardUid);
    if (payload) {
      redirectCache.set(cardUid, { data: payload, timestamp: Date.now() });
    }
  }

  if (!payload) return { ok: false, status: 404, message: "Card not found" };
  if (!payload.is_active) return { ok: false, status: 410, message: "Card inactive" };

  setImmediate(async () => {
    try {
      const ua = metadata.browser || "";
      const os = ua.includes("Windows") ? "Windows" : ua.includes("Mac") ? "MacOS" : ua.includes("Android") ? "Android" : ua.includes("iPhone") ? "iOS" : "Other";
      const device = ua.includes("Mobi") ? "Mobile" : "Desktop";

      await Card.increment("tap_count", { by: 1, where: { card_uid: cardUid } });
      await AnalyticsEvent.create({ 
        cardId: cardUid, 
        userId: payload.User?.id || "SYSTEM", 
        type: "tap",
        browser: ua.substring(0, 255),
        os,
        device,
        ip: metadata.ip,
      });
    } catch (e) {
      console.error("Failed to log tap natively:", e);
    }
  });

  // Extract active links and sort them
  let links = (payload.Links || []).filter((l) => l.is_active);
  links.sort((a, b) => a.order - b.order);

  const google = links.find((l) => l.type === "google_review");

  // Legacy direct google URL hardcode check
  if (payload.redirect_mode === "DIRECT" && payload.direct_google_url) {
    return { ok: true, mode: "redirect", url: payload.direct_google_url };
  }

  // Smart Profile Direct Mode check
  if (payload.Profile?.mode === "DIRECT" && google?.url) {
    return { ok: true, mode: "redirect", url: google.url };
  }

  return {
    ok: true,
    mode: "smart",
    data: {
      cardUid,
      user: payload.User ? { id: payload.User.id, name: payload.User.name } : null,
      profile: payload.Profile || null,
      links: links.map((l) => ({ type: l.type, url: l.url, label: l.label, order: l.order })),
    },
  };
}

async function updateCard(id, body) {
  const card = await Card.findOne({ where: { card_uid: id } });
  if (!card) return { ok: false, status: 404, message: "Card not found" };

  await card.update(body);
  redirectCache.delete(id); // Invalidate cache on metadata change
  return { ok: true, data: card };
}

// Ensure you export the cache map if you want to invalidate it from profiles.service updates!
module.exports = {
  createCard,
  assignCard,
  sellCardWithBuyer,
  reassignCard,
  bulkUpload,
  getUserCards,
  setCardStatus,
  handleTap,
  updateCard,
  redirectCache,
};
