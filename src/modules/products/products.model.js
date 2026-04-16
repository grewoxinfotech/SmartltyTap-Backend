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

function updateProduct(id, data) {
  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;

  return Product.update(updateData, { where: { id } });
}

function deleteProduct(id) {
  return Product.update({ is_active: false }, { where: { id } });
}

module.exports = { listProducts, createProduct, updateProduct, deleteProduct };

