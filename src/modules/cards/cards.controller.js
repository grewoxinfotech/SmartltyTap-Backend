const { ok, fail } = require("../../utils/response");
const { createCardSchema, updateCardStatusSchema } = require("./cards.validators");
const cardsService = require("./cards.service");

async function create(req, res) {
  const parsed = createCardSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cardsService.createCard(parsed.data);
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

async function listByUser(req, res) {
  const result = await cardsService.getUserCards(req.params.userId);
  return ok(res, result.data);
}

async function status(req, res) {
  const parsed = updateCardStatusSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cardsService.setCardStatus(req.params.cardId, parsed.data.isActive);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function redirect(req, res) {
  const result = await cardsService.handleTap(req.params.cardId);
  if (!result.ok) return fail(res, result.status, result.message);
  if (result.mode === "redirect") return res.redirect(result.url);
  return ok(res, result.data);
}

module.exports = { create, bulkUpload, assign, listByUser, status, redirect };

