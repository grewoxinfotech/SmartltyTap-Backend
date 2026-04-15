const { Router } = require("express");
const { ok, fail } = require("../../utils/response");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { z } = require("zod");
const { AnalyticsTap, AnalyticsClick } = require("../../models");

const router = Router();

router.post("/tap", async (req, res) => {
  const schema = z.object({ cardId: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  await AnalyticsTap.create({ card_uid: parsed.data.cardId });
  return ok(res, { stored: true });
});

router.post("/click", async (req, res) => {
  const schema = z.object({ userId: z.string().min(1), platform: z.enum(["GOOGLE", "WHATSAPP", "INSTAGRAM", "WEBSITE"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  await AnalyticsClick.create({ user_id: parsed.data.userId, platform: parsed.data.platform });
  return ok(res, { stored: true });
});

router.get("/:userId", requireAuth, async (req, res) => {
  const userId = req.params.userId;
  const totalTaps = await AnalyticsTap.count();
  const clicks = await AnalyticsClick.findAll({ where: { user_id: userId }, attributes: ["platform"] });
  const clicksByPlatform = clicks.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + 1;
    return acc;
  }, {});
  return ok(res, { totalTaps, clicksByPlatform });
});

router.get("/summary", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const totalTaps = await AnalyticsTap.count();
  return ok(res, { totalTaps });
});

module.exports = router;

