const productsRepository = require("./products.repository");

async function getProducts() {
  const items = await productsRepository.listProducts();
  return { ok: true, data: items };
}

async function addProduct(payload) {
  const created = await productsRepository.createProduct(payload);
  return { ok: true, data: created };
}

async function updateProduct(id, payload) {
  const [updatedCount] = await productsRepository.updateProduct(id, payload);
  if (updatedCount === 0) return { ok: false, status: 404, message: "Product not found" };
  return { ok: true, data: { id, ...payload } };
}

async function removeProduct(id) {
  const [updatedCount] = await productsRepository.deleteProduct(id);
  if (updatedCount === 0) return { ok: false, status: 404, message: "Product not found" };
  return { ok: true, data: { id, deleted: true } };
}

module.exports = { getProducts, addProduct, updateProduct, removeProduct };

