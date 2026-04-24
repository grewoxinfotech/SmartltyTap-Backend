const { Router } = require("express");
const { z } = require("zod");
const { ok, fail } = require("../../utils/response");
const { requireAuth, requireRole, requirePermission } = require("../../middleware/auth");
const { AdminPermission, ActivityLog, User } = require("../../models");

const router = Router();

// Create/update sub-admin permissions
router.post("/admins/:userId/permissions", requireAuth, requireRole(["SUPER_ADMIN"]), async (req, res) => {
  const schema = z.object({
    isSuper: z.boolean().optional(),
    isActive: z.boolean().optional(),
    permissions: z.record(z.boolean()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const user = await User.findByPk(req.params.userId);
  if (!user || user.role !== "ADMIN") return fail(res, 404, "Admin user not found");

  const [perm] = await AdminPermission.upsert({
    user_id: req.params.userId,
    is_super: parsed.data.isSuper ?? false,
    is_active: parsed.data.isActive ?? true,
    permissions: parsed.data.permissions || {},
  });

  return ok(res, perm);
});

router.get("/admins", requireAuth, requireRole(["SUPER_ADMIN"]), async (_req, res) => {
  const admins = await User.findAll({ where: { role: "ADMIN" }, attributes: ["id", "name", "email", "is_active"] });
  const perms = await AdminPermission.findAll();
  const map = new Map(perms.map((p) => [p.user_id, p]));
  const items = admins.map((a) => ({ ...a.toJSON(), permissions: map.get(a.id) || null }));
  return ok(res, items);
});

// Activity logs (sub-admin can view if permission enabled)
router.get("/activity", requireAuth, requirePermission("view_activity_logs"), async (req, res) => {
  const { page = "1", limit = "50" } = req.query;
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(200, Math.max(1, Number(limit) || 50));
  const offset = (pageNum - 1) * limitNum;

  const { rows, count } = await ActivityLog.findAndCountAll({
    order: [["created_at", "DESC"]],
    offset,
    limit: limitNum,
  });

  return ok(res, { items: rows, pagination: { page: pageNum, limit: limitNum, total: count } });
});

module.exports = router;

