const { ok, fail } = require("../../utils/response");
const { createCardSchema, sellCardSchema, updateCardStatusSchema } = require("./cards.validators");
const cardsService = require("./cards.service");

async function create(req, res) {
  const parsed = createCardSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cardsService.createCard(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function bulkUpload(req, res) {
  if (!req.file) return fail(res, 400, "CSV file is required");
  const result = await cardsService.bulkUpload(req.file.path);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function assign(req, res) {
  const { cardUid, userId } = req.body;
  if (!cardUid || !userId) return fail(res, 400, "cardUid and userId are required");
  const result = await cardsService.assignCard(cardUid, userId);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function sell(req, res) {
  const parsed = sellCardSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cardsService.sellCardWithBuyer(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function reassign(req, res) {
  const { oldCardUid, newCardUid, userId } = req.body;
  if (!oldCardUid || !newCardUid) return fail(res, 400, "oldCardUid and newCardUid are required");
  const result = await cardsService.reassignCard(oldCardUid, newCardUid, userId);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function listByUser(req, res) {
  const result = await cardsService.getUserCards(req.params.userId);
  if (!result.ok) return fail(res, result.status || 500, result.message);
  return ok(res, result.data);
}

async function status(req, res) {
  const parsed = updateCardStatusSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cardsService.setCardStatus(req.params.id, parsed.data.isActive);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function update(req, res) {
  const result = await cardsService.updateCard(req.params.id, req.body);
  if (!result.ok) return fail(res, result.status || 500, result.message);
  return ok(res, result.data);
}

async function redirect(req, res) {
  const metadata = {
    browser: req.headers["user-agent"],
    ip: req.ip || req.headers["x-forwarded-for"],
  };
  const result = await cardsService.handleTap(req.params.cardId, metadata);
  if (!result.ok) return fail(res, result.status, result.message);
  if (result.mode === "redirect") return res.redirect(result.url);
  return ok(res, result.data);
}

module.exports = { create, bulkUpload, assign, sell, reassign, listByUser, status, update, redirect };

