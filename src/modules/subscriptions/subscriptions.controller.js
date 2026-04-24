const { z } = require("zod");
const { ok, fail } = require("../../utils/response");
const service = require("./subscriptions.service");

async function getPlans(_req, res) {
  const plans = await service.listPlans();
  return ok(res, plans);
}

async function upsertPlan(req, res) {
  const schema = z.object({
    code: z.string().min(2).max(30),
    name: z.string().min(2).max(100),
    price: z.number().min(0),
    billingCycle: z.enum(["MONTHLY", "YEARLY"]).default("MONTHLY"),
    isActive: z.boolean().default(true),
    features: z.record(z.any()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const saved = await service.savePlan({
    code: parsed.data.code,
    name: parsed.data.name,
    price: parsed.data.price,
    billingCycle: parsed.data.billingCycle,
    isActive: parsed.data.isActive,
    features: parsed.data.features,
  });
  return ok(res, saved);
}

async function assign(req, res) {
  const schema = z.object({
    userId: z.string().min(1),
    planCode: z.string().min(2),
    billingMode: z.enum(["MANUAL", "AUTO"]).default("MANUAL"),
    nextBillingAt: z.string().datetime().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await service.assignPlan({
    userId: parsed.data.userId,
    planCode: parsed.data.planCode.toUpperCase(),
    billingMode: parsed.data.billingMode,
    nextBillingAt: parsed.data.nextBillingAt,
  });
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function getUserSubscription(req, res) {
  const sub = await service.getUserSubscription(req.params.userId);
  return ok(res, sub);
}

async function createInvoice(req, res) {
  const schema = z.object({
    userId: z.string().min(1),
    planCode: z.string().min(2),
    amount: z.number().positive(),
    dueDate: z.string().datetime().optional(),
    notes: z.string().max(2000).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await service.createInvoice(parsed.data);
  return ok(res, result);
}

async function listInvoices(req, res) {
  const userId = req.query.userId ? String(req.query.userId) : null;
  const status = req.query.status ? String(req.query.status).toUpperCase() : null;
  const rows = await service.listInvoices({ userId, status });
  return ok(res, rows);
}

async function updateInvoiceStatus(req, res) {
  const schema = z.object({ status: z.enum(["DUE", "PAID", "VOID"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await service.setInvoiceStatus({ id: req.params.id, status: parsed.data.status });
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = {
  getPlans,
  upsertPlan,
  assign,
  getUserSubscription,
  createInvoice,
  listInvoices,
  updateInvoiceStatus,
};

