const productsModel = require("./products.model");

async function getProducts() {
  const items = await productsModel.listProducts();
  return { ok: true, data: items };
}

async function addProduct(payload) {
  const created = await productsModel.createProduct(payload);
  return { ok: true, data: created };
}

async function updateProduct(id, payload) {
  const [updatedCount] = await productsModel.updateProduct(id, payload);
  if (updatedCount === 0) return { ok: false, status: 404, message: "Product not found" };
  return { ok: true, data: { id, ...payload } };
}

async function removeProduct(id) {
  const [updatedCount] = await productsModel.deleteProduct(id);
  if (updatedCount === 0) return { ok: false, status: 404, message: "Product not found" };
  return { ok: true, data: { id, deleted: true } };
}

module.exports = { getProducts, addProduct, updateProduct, removeProduct };

