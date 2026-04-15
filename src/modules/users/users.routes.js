const { Router } = require("express");
const { z } = require("zod");
const { pool } = require("../../db/pool");
const { ok, fail } = require("../../utils/response");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();

router.get("/", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const [rows] = await pool.query("SELECT id, name, email, role, plan, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 500");
  return ok(res, rows);
});

router.patch("/:id/plan", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const schema = z.object({ plan: z.enum(["BASIC", "PREMIUM"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const [result] = await pool.query("UPDATE users SET plan = ? WHERE id = ?", [parsed.data.plan, req.params.id]);
  if (!result.affectedRows) return fail(res, 404, "User not found");
  return ok(res, { id: req.params.id, plan: parsed.data.plan });
});

router.patch("/:id/status", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const schema = z.object({ isActive: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const [result] = await pool.query("UPDATE users SET is_active = ? WHERE id = ?", [parsed.data.isActive ? 1 : 0, req.params.id]);
  if (!result.affectedRows) return fail(res, 404, "User not found");
  return ok(res, { id: req.params.id, isActive: parsed.data.isActive });
});

module.exports = router;

