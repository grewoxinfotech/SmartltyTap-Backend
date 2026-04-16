const { Router } = require("express");
const { ok, fail } = require("../../utils/response");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { z } = require("zod");
const { AnalyticsEvent, Card } = require("../../models");

const router = Router();

router.post("/tap", async (req, res) => {
  const schema = z.object({ cardId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  
  const card = await Card.findByPk(parsed.data.cardId);
  if (!card) return fail(res, 404, "Card not found");

  await AnalyticsEvent.create({ cardId: card.id, userId: card.user_id, type: "tap" });
  return ok(res, { stored: true });
});

router.post("/click", async (req, res) => {
  const schema = z.object({ cardId: z.string().min(1), userId: z.string().min(1), type: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  
  await AnalyticsEvent.create({ cardId: parsed.data.cardId, userId: parsed.data.userId, type: parsed.data.type });
  return ok(res, { stored: true });
});

router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  const taps = await AnalyticsEvent.count({ where: { userId, type: "tap" } });
  
  const clicks = await AnalyticsEvent.findAll({ where: { userId } });
  const clicksByPlatform = clicks.reduce((acc, c) => {
    if (c.type !== "tap") {
      acc[c.type] = (acc[c.type] || 0) + 1;
    }
    return acc;
  }, {});
  
  return ok(res, { totalTaps: taps, clicksByPlatform });
});

router.get("/summary", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const totalTaps = await AnalyticsEvent.count({ where: { type: "tap" } });
  return ok(res, { totalTaps });
});

module.exports = router;

