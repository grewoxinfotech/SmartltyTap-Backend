const { Router } = require("express");
const { z } = require("zod");
const { requireAuth, requireRole } = require("../../middleware/auth");
const { ok, fail } = require("../../utils/response");
const { User, Reseller, Order, OrderItem, Product } = require("../../models");
const generateId = require("../../middlewares/generatorId");

const router = Router();

// POST /reseller/create
router.post("/create", requireAuth, requireRole(["ADMIN"]), async (req, res) => {
  const schema = z.object({
    userId: z.string().min(1),
    pricingDiscountPct: z.number().min(0).max(90).default(10),
    commissionPct: z.number().min(0).max(90).default(10),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const user = await User.findByPk(parsed.data.userId);
  if (!user) return fail(res, 404, "User not found");
  await user.update({ role: "RESELLER" });

  const existing = await Reseller.findOne({ where: { user_id: user.id } });
  if (existing) return ok(res, existing);

  const reseller = await Reseller.create({
    user_id: user.id,
    pricing_discount_pct: parsed.data.pricingDiscountPct,
    commission_pct: parsed.data.commissionPct,
  });
  return ok(res, reseller);
});

// POST /reseller/order (bulk order)
router.post("/order", requireAuth, requireRole(["RESELLER"]), async (req, res) => {
  const schema = z.object({
    items: z.array(z.object({ productId: z.string().min(1), qty: z.number().int().min(1).max(1000) })).min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const reseller = await Reseller.findOne({ where: { user_id: req.user.id } });
  if (!reseller) return fail(res, 403, "Not a reseller");

  let amount = 0;
  for (const it of parsed.data.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findByPk(it.productId);
    if (!product) return fail(res, 404, `Product not found: ${it.productId}`);
    amount += Number(product.price) * it.qty;
  }
  const discount = (amount * Number(reseller.pricing_discount_pct)) / 100;
  const finalAmount = Number((amount - discount).toFixed(2));

  const order = await Order.create({ id: generateId("ORD"), user_id: req.user.id, status: "PENDING", amount: finalAmount, currency: "INR" });
  for (const it of parsed.data.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findByPk(it.productId);
    // eslint-disable-next-line no-await-in-loop
    await OrderItem.create({ order_id: order.id, product_id: it.productId, qty: it.qty, price: product.price });
  }

  const commission = (finalAmount * Number(reseller.commission_pct)) / 100;
  await reseller.update({
    total_sales: Number(reseller.total_sales) + finalAmount,
    commission_earned: Number(reseller.commission_earned) + commission,
  });

  return ok(res, { order, discount, commission });
});

// GET /reseller/analytics
router.get("/analytics", requireAuth, requireRole(["RESELLER"]), async (req, res) => {
  const reseller = await Reseller.findOne({ where: { user_id: req.user.id } });
  if (!reseller) return fail(res, 403, "Not a reseller");
  return ok(res, reseller);
});

module.exports = router;

