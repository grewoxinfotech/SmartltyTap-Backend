const { ok, fail } = require("../../utils/response");
const { addToCartSchema, removeFromCartSchema } = require("./cart.validators");
const cartService = require("./cart.service");

async function add(req, res) {
  const parsed = addToCartSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cartService.addItem(parsed.data);
  return ok(res, result.data);
}

async function remove(req, res) {
  const parsed = removeFromCartSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await cartService.removeItem(parsed.data);
  return ok(res, result.data);
}

async function get(req, res) {
  const result = await cartService.getCart(req.params.userId);
  return ok(res, result.data);
}

module.exports = { add, remove, get };

