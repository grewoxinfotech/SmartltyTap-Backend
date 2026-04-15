const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { User, Order, Card } = require("../../models");
const { ok } = require("../../utils/response");

const router = Router();

router.get("/users", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const users = await User.findAll({ attributes: ["id", "name", "email", "role", "plan", "is_active"], order: [["created_at", "DESC"]] });
  return ok(res, users);
});

router.get("/orders", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const orders = await Order.findAll({ order: [["created_at", "DESC"]] });
  return ok(res, orders);
});

router.get("/cards", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const cards = await Card.findAll({ order: [["created_at", "DESC"]] });
  return ok(res, cards);
});

module.exports = router;

