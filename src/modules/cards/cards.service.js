const cardsModel = require("./cards.model");
const { AnalyticsTap, Card } = require("../../models");
const fs = require("fs");
const csv = require("csv-parser");

// Ultra-fast in-memory cache for NFC Redirect Engine
const redirectCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function createCard({ userId }) {
  const card = await cardsModel.createCardForUser(userId);
  return { ok: true, data: card };
}

async function assignCard(cardUid, userId) {
  const card = await Card.findOne({ where: { card_uid: cardUid } });
  if (!card) return { ok: false, status: 404, message: "Card not found" };
  
  await card.update({ user_id: userId, is_active: true });
  redirectCache.delete(cardUid);
  return { ok: true, data: { cardUid, userId } };
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
  const cards = await cardsModel.listCardsByUser(userId);
  return { ok: true, data: cards };
}

async function setCardStatus(cardUid, isActive) {
  const count = await cardsModel.updateCardStatus(cardUid, isActive);
  if (!count) return { ok: false, status: 404, message: "Card not found" };
  redirectCache.delete(cardUid); // Invalidate cache on status change
  return { ok: true, data: { cardUid, isActive } };
}

async function handleTap(cardUid) {
  let payload;
  const cached = redirectCache.get(cardUid);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    payload = cached.data;
  } else {
    payload = await cardsModel.findCardRedirectPayload(cardUid);
    if (payload) {
      redirectCache.set(cardUid, { data: payload, timestamp: Date.now() });
    }
  }

  if (!payload) return { ok: false, status: 404, message: "Card not found" };
  if (!payload.is_active) return { ok: false, status: 410, message: "Card inactive" };

  // Log asynchronously so we don't block the redirect response!
  // (<100ms response optimization)
  setImmediate(async () => {
    try {
      await Card.increment("tap_count", { by: 1, where: { card_uid: cardUid } });
      await AnalyticsTap.create({ card_uid: cardUid });
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

// Ensure you export the cache map if you want to invalidate it from profiles.service updates!
module.exports = { createCard, assignCard, bulkUpload, getUserCards, setCardStatus, handleTap, redirectCache };
