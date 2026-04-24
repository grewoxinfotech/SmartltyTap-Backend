const { Plan, UserSubscription, Invoice, User } = require("../../models");

const DEFAULT_PLANS = [
  { code: "FREE", name: "Free", price: 0, billingCycle: "MONTHLY", isActive: true, features: { cards: 1 } },
  { code: "BASIC", name: "Basic", price: 499, billingCycle: "MONTHLY", isActive: true, features: { cards: 3 } },
  { code: "PRO", name: "Pro", price: 1499, billingCycle: "MONTHLY", isActive: true, features: { cards: 20 } },
];

async function ensureSeeded() {
  for (const p of DEFAULT_PLANS) {
    // eslint-disable-next-line no-await-in-loop
    await Plan.upsert({
      code: p.code,
      name: p.name,
      price: p.price,
      billing_cycle: p.billingCycle,
      is_active: p.isActive,
      features: p.features,
    });
  }
}

async function listPlans() {
  await ensureSeeded();
  return Plan.findAll({ order: [["price", "ASC"]] });
}

async function savePlan(payload) {
  await ensureSeeded();
  await Plan.upsert({
    code: payload.code.toUpperCase(),
    name: payload.name,
    price: payload.price,
    billing_cycle: payload.billingCycle,
    is_active: payload.isActive,
    features: payload.features || {},
  });
  return { code: payload.code.toUpperCase(), saved: true };
}

async function assignPlan({ userId, planCode, billingMode, nextBillingAt }) {
  await ensureSeeded();
  const user = await User.findByPk(userId);
  if (!user) return { ok: false, status: 404, message: "Associated user identity not found" };

  const plan = await Plan.findOne({ where: { code: planCode, is_active: true } });
  if (!plan) return { ok: false, status: 404, message: "Plan not found" };

  await UserSubscription.upsert({
    user_id: userId,
    plan_code: planCode,
    status: "ACTIVE",
    billing_mode: billingMode,
    next_billing_at: nextBillingAt ? new Date(nextBillingAt) : null,
  });

  // Back-compat: existing `users.plan` enum is BASIC/PREMIUM.
  const planEnum = planCode === "FREE" ? "BASIC" : "PREMIUM";
  await User.update({ plan: planEnum }, { where: { id: userId } });

  return { ok: true, data: { userId, planCode, billingMode } };
}

async function getUserSubscription(userId) {
  await ensureSeeded();
  return UserSubscription.findOne({ where: { user_id: userId }, include: [{ model: Plan, attributes: ["code", "name", "price", "billing_cycle"] }] });
}

async function createInvoice(payload) {
  await ensureSeeded();
  const user = await User.findByPk(payload.userId);
  if (!user) return { ok: false, status: 404, message: "Associated user identity not found" };

  const invoice = await Invoice.create({
    user_id: payload.userId,
    plan_code: payload.planCode.toUpperCase(),
    amount: payload.amount,
    due_date: payload.dueDate ? new Date(payload.dueDate) : null,
    notes: payload.notes || null,
  });
  const invoiceId = invoice.id;
  return { invoiceId, created: true };
}

async function listInvoices(filters) {
  await ensureSeeded();
  const where = {};
  if (filters.userId) where.user_id = filters.userId;
  if (filters.status) where.status = filters.status;
  return Invoice.findAll({ where, order: [["created_at", "DESC"]] });
}

async function setInvoiceStatus({ id, status }) {
  await ensureSeeded();
  const paidAt = status === "PAID" ? new Date() : null;
  const [affected] = await Invoice.update({ status, paid_at: paidAt }, { where: { id: Number(id) } });
  if (!affected) return { ok: false, status: 404, message: "Invoice not found" };
  return { ok: true, data: { id: Number(id), status } };
}

module.exports = {
  ensureSeeded,
  listPlans,
  savePlan,
  assignPlan,
  getUserSubscription,
  createInvoice,
  listInvoices,
  setInvoiceStatus,
};

