const { Product } = require("../../models");

function listProducts() {
  return Product.findAll({ where: { is_active: true }, order: [["created_at", "DESC"]] });
}

function createProduct(data) {
  return Product.create({
    name: data.name,
    description: data.description || null,
    price: data.price,
    stock: data.stock,
    image_url: data.imageUrl || null,
    is_active: true,
  });
}

module.exports = { listProducts, createProduct };

