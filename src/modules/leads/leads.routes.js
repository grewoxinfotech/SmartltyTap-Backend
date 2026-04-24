const { Router } = require("express");
const { z } = require("zod");
const { Op } = require("sequelize");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { ok, fail } = require("../../utils/response");
const { Lead, User } = require("../../models");

const router = Router();

router.post("/", async (req, res) => {
  const schema = z.object({
    userId: z.string().min(1),
    cardUid: z.string().optional(),
    name: z.string().min(2),
    email: z.string().email().optional(),
    phone: z.string().min(6).max(20).optional(),
    message: z.string().max(2000).optional(),
    source: z.string().max(100).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const lead = await Lead.create({
    user_id: parsed.data.userId,
    card_uid: parsed.data.cardUid || null,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    message: parsed.data.message || null,
    source: parsed.data.source || "web",
  });

  const { sendLeadNotification } = require("../notifications/notifications.service");
  setImmediate(() => sendLeadNotification(parsed.data.userId, lead));

  return ok(res, { id: lead.id, created: true });
});

router.get("/", requireAuth, requireRole(["SUPER_ADMIN"]), async (req, res) => {
  const { userId, from, to, page = "1", limit = "50" } = req.query;
  const where = {};
  if (userId) where.user_id = String(userId);

  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = new Date(String(from));
    if (to) where.created_at[Op.lte] = new Date(String(to));
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(500, Math.max(1, Number(limit) || 50));
  const offset = (pageNum - 1) * limitNum;

  const { rows, count } = await Lead.findAndCountAll({
    where,
    include: [{ model: User, attributes: ["id", "name", "email"] }],
    order: [["created_at", "DESC"]],
    offset,
    limit: limitNum,
  });

  return ok(res, {
    items: rows,
    pagination: { page: pageNum, limit: limitNum, total: count },
  });
});

router.get("/export.csv", requireAuth, requireRole(["SUPER_ADMIN"]), async (req, res) => {
  const { userId, from, to } = req.query;
  const where = {};
  if (userId) where.user_id = String(userId);
  if (from || to) {
    where.created_at = {};
    if (from) where.created_at[Op.gte] = new Date(String(from));
    if (to) where.created_at[Op.lte] = new Date(String(to));
  }

  const leads = await Lead.findAll({ where, order: [["created_at", "DESC"]] });
  const header = ["id", "user_id", "card_uid", "name", "email", "phone", "message", "source", "created_at"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    header.join(","),
    ...leads.map((l) =>
      [l.id, l.user_id, l.card_uid, l.name, l.email, l.phone, l.message, l.source, l.created_at].map(esc).join(",")
    ),
  ];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=leads-export.csv");
  return res.status(200).send(lines.join("\n"));
});

module.exports = router;
