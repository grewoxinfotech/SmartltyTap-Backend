const { ok, fail } = require("../../utils/response");
const { createProductSchema, updateProductSchema } = require("./products.validators");
const productsService = require("./products.service");

async function list(req, res) {
  const result = await productsService.getProducts();
  return ok(res, result.data);
}

async function create(req, res) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload", parsed.error.errors);
  const result = await productsService.addProduct(parsed.data);
  return ok(res, result.data);
}

async function update(req, res) {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload", parsed.error.errors);
  const result = await productsService.updateProduct(req.params.id, parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function remove(req, res) {
  const result = await productsService.removeProduct(req.params.id);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = { list, create, update, remove };

