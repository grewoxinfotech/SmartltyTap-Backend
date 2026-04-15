const productsModel = require("./products.model");

async function getProducts() {
  const items = await productsModel.listProducts();
  return { ok: true, data: items };
}

async function addProduct(payload) {
  const created = await productsModel.createProduct(payload);
  return { ok: true, data: created };
}

module.exports = { getProducts, addProduct };

