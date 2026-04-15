const { ok, fail } = require("../../utils/response");
const { createOrderSchema } = require("./orders.validators");
const ordersService = require("./orders.service");

async function create(req, res) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await ordersService.create(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function list(req, res) {
  const result = await ordersService.list(req.params.userId);
  return ok(res, result.data);
}

async function details(req, res) {
  const result = await ordersService.details(req.params.orderId);
  return ok(res, result.data);
}

module.exports = { create, list, details };

