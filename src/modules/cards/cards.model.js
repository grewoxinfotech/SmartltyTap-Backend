const { Card, Profile, Link, User } = require("../../models");

async function createCardForUser(userId) {
  return Card.create({ user_id: userId });
}

async function listCardsByUser(userId) {
  return Card.findAll({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
}

async function updateCardStatus(cardUid, isActive) {
  const [count] = await Card.update({ is_active: isActive }, { where: { card_uid: cardUid } });
  return count;
}

async function findCardRedirectPayload(cardUid) {
  // Single optimized query for tap redirect
  return Card.findOne({
    where: { card_uid: cardUid },
    attributes: ["card_uid", "is_active", "redirect_mode", "direct_google_url", "user_id"],
    include: [
      { model: User, attributes: ["id", "name"] },
      { model: Profile, attributes: ["mode", "template", "logo_url", "brand_primary", "brand_secondary"] },
      { model: Link, attributes: ["type", "url", "is_active", "order"] },
    ],
  });
}

module.exports = { createCardForUser, listCardsByUser, updateCardStatus, findCardRedirectPayload };

