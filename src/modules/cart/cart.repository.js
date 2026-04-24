const { CartItem, Product } = require("../../models");

async function upsertItem(userId, productId, qty) {
  const existing = await CartItem.findOne({ where: { user_id: userId, product_id: productId } });
  if (existing) return existing.update({ qty: existing.qty + qty });
  return CartItem.create({ user_id: userId, product_id: productId, qty });
}

async function removeItem(userId, productId) {
  return CartItem.destroy({ where: { user_id: userId, product_id: productId } });
}

async function listCart(userId) {
  return CartItem.findAll({
    where: { user_id: userId },
    include: [{ model: Product, attributes: ["id", "name", "price", "image_url"] }],
    order: [["updated_at", "DESC"]],
  });
}

module.exports = { upsertItem, removeItem, listCart };

