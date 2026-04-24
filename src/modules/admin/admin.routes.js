const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { User, Order, Card, Payment, AnalyticsEvent } = require("../../models");
const { ok, fail } = require("../../utils/response");
const { Op, fn, col, literal } = require("sequelize");
const { generateInvoicePDF } = require("../../utils/pdf");

const router = Router();

// Dashboard Metrics
router.get("/dashboard", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), async (_req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "USER" } });
    const totalCards = await Card.count();
    const totalOrders = await Order.count();
    const revenueResult = await Order.sum("amount", { where: { status: "PAID" } });
    const totalTaps = await AnalyticsEvent.count({ where: { type: "tap" } });

    const perUserTaps = await AnalyticsEvent.findAll({
      attributes: ["userId", [fn("COUNT", col("id")), "taps"]],
      where: { type: "tap" },
      group: ["userId"],
      order: [[literal("taps"), "DESC"]],
      limit: 10,
    });

    const dailyTaps = await AnalyticsEvent.findAll({
      attributes: [[fn("DATE", col("timestamp")), "day"], [fn("COUNT", col("id")), "count"]],
      where: { type: "tap", timestamp: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 30 DAY)") } },
      group: [fn("DATE", col("timestamp"))],
      order: [[fn("DATE", col("timestamp")), "ASC"]],
    });

    const monthlyTaps = await AnalyticsEvent.findAll({
      attributes: [[fn("DATE_FORMAT", col("timestamp"), "%Y-%m"), "month"], [fn("COUNT", col("id")), "count"]],
      where: { type: "tap", timestamp: { [Op.gte]: literal("DATE_SUB(NOW(), INTERVAL 12 MONTH)") } },
      group: [fn("DATE_FORMAT", col("timestamp"), "%Y-%m")],
      order: [[fn("DATE_FORMAT", col("timestamp"), "%Y-%m"), "ASC"]],
    });

    const activeUsers = await User.count({ where: { role: "USER", is_active: true } });

    return ok(res, {
      totalUsers,
      totalCards,
      ordersCount: totalOrders,
      totalRevenue: revenueResult || 0,
      totalTaps,
      usage: {
        daily: dailyTaps,
        monthly: monthlyTaps,
        topUsersByTaps: perUserTaps,
      },
      diagnostics: {
        deviceAnalytics: [],
        locationAnalytics: [],
        note: "Device/location analytics need client metadata capture on tap/click events.",
      },
      recentActivity: [
        { id: 1, message: "System operational", date: new Date().toISOString() }
      ],
      activeUsers,
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

router.get("/payments", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), async (_req, res) => {
  const payments = await Payment.findAll({ order: [["created_at", "DESC"]] });
  return ok(res, payments);
});

router.get("/resellers", requireAuth, requireRole(["ADMIN"]), async (_req, res) => {
  const { Reseller, User } = require("../../models");
  const resellers = await Reseller.findAll({ 
    include: [{ model: User, as: "user", attributes: ["name", "email"] }],
    order: [["created_at", "DESC"]] 
  });
  return ok(res, resellers);
});

router.post("/resellers", requireAuth, requireRole(["SUPER_ADMIN"]), async (req, res) => {
  const { Reseller } = require("../../models");
  const reseller = await Reseller.create(req.body);
  return ok(res, reseller);
});

module.exports = router;

