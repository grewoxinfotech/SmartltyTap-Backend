const { Order, OrderItem, Product } = require("../../models");

async function createOrder({ userId, items, amount, currency }) {
  const order = await Order.create({ user_id: userId, amount, currency, status: "PENDING" });
  for (const it of items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findByPk(it.productId);
    // eslint-disable-next-line no-await-in-loop
    await OrderItem.create({
      order_id: order.id,
      product_id: it.productId,
      qty: it.qty,
      price: product ? product.price : 0,
    });
  }
  return order;
}

function listOrdersByUser(userId) {
  return Order.findAll({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
}

async function getOrderWithItems(orderId) {
  const order = await Order.findByPk(orderId);
  const items = await OrderItem.findAll({ where: { order_id: orderId }, include: [{ model: Product }] });
  return { order, items };
}

async function setOrderStatus(orderId, status) {
  const [count] = await Order.update({ status }, { where: { id: orderId } });
  return count;
}

module.exports = { createOrder, listOrdersByUser, getOrderWithItems, setOrderStatus };

