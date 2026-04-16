const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { User, Order, Card, AnalyticsTap } = require("../../models");
const { ok, fail } = require("../../utils/response");
const sequelize = require("../../config/db");
const { generateInvoicePDF } = require("../../utils/pdf");

const router = Router();

// Dashboard Metrics
router.get("/dashboard", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), async (_req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "USER", is_active: true } });
    const totalCards = await Card.count();
    const totalOrders = await Order.count();
    const revenueResult = await Order.sum("amount", { where: { status: "PAID" } });
    
    return ok(res, {
      activeUsers: totalUsers,
      totalCards,
      ordersCount: totalOrders,
      totalRevenue: revenueResult || 0,
      recentActivity: [
        { id: 1, message: "System operational", date: new Date().toISOString() }
      ]
    });
  } catch (error) {
    return fail(res, 500, error.message);
  }
});

router.get("/users", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), async (_req, res) => {
  const users = await User.findAll({ attributes: ["id", "name", "email", "role", "plan", "is_active"], order: [["created_at", "DESC"]] });
  return ok(res, users);
});

router.get("/orders", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const orders = await Order.findAll({ order: [["created_at", "DESC"]] });
  return ok(res, orders);
});

// Update Order Status
router.patch("/orders/:id/status", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const { status } = req.body;
  if (!["PENDING", "PAID", "PROCESSING", "DELIVERED"].includes(status)) {
    return fail(res, 400, "Invalid status");
  }
  const order = await Order.findByPk(req.params.id);
  if (!order) return fail(res, 404, "Order not found");
  
  order.status = status;
  await order.save();
  return ok(res, { id: order.id, status: order.status });
});

// Download Invoice PDF
router.get("/orders/:id/invoice", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  try {
    await generateInvoicePDF(req.params.id, res);
  } catch (error) {
    return fail(res, 500, "Failed to generate PDF");
  }
});

router.get("/cards", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const cards = await Card.findAll({ order: [["created_at", "DESC"]] });
  return ok(res, cards);
});

module.exports = router;

