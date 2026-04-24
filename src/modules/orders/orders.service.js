const { Product } = require("../../models");
const ordersRepository = require("./orders.repository");

async function create(payload) {
  let amount = 0;
  for (const it of payload.items) {
    // eslint-disable-next-line no-await-in-loop
    const product = await Product.findByPk(it.productId);
    if (!product) return { ok: false, status: 404, message: `Product not found: ${it.productId}` };
    amount += Number(product.price) * it.qty;
  }
  const order = await ordersRepository.createOrder({ userId: payload.userId, items: payload.items, amount, currency: "INR" });
  return { ok: true, data: order };
}

async function list(userId) {
  const orders = await ordersRepository.listOrdersByUser(userId);
  return { ok: true, data: orders };
}

async function details(orderId) {
  const data = await ordersRepository.getOrderWithItems(orderId);
  return { ok: true, data };
}

module.exports = { create, list, details };

