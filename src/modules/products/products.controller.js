const { ok, fail } = require("../../utils/response");
const { createProductSchema } = require("./products.validators");
const productsService = require("./products.service");

async function list(req, res) {
  const result = await productsService.getProducts();
  return ok(res, result.data);
}

async function create(req, res) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await productsService.addProduct(parsed.data);
  return ok(res, result.data);
}

module.exports = { list, create };

