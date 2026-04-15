const crypto = require("crypto");
const { env } = require("../../config/env");
const { Order, Payment } = require("../../models");

async function createRazorpayOrder(orderId) {
  const order = await Order.findByPk(orderId);
  if (!order) return { ok: false, status: 404, message: "Order not found" };

  // For real Razorpay: call Razorpay API here. For now create a consistent mock order id.
  const razorpay_order_id = `order_${crypto.randomBytes(8).toString("hex")}`;
  const payment = await Payment.create({
    order_id: order.id,
    provider: "RAZORPAY",
    razorpay_order_id,
    status: "CREATED",
    amount: order.amount,
    currency: order.currency,
  });
  return { ok: true, data: { paymentId: payment.id, razorpay_order_id, amount: order.amount, currency: order.currency } };
}

function verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto.createHmac("sha256", env.razorpay.secret).update(body).digest("hex");
  return expected === razorpay_signature;
}

async function verifyAndCapture(payload) {
  const okSig = verifySignature(payload);
  if (!okSig) return { ok: false, status: 400, message: "Invalid signature" };

  const payment = await Payment.findOne({ where: { razorpay_order_id: payload.razorpay_order_id } });
  if (!payment) return { ok: false, status: 404, message: "Payment not found" };

  await payment.update({
    razorpay_payment_id: payload.razorpay_payment_id,
    razorpay_signature: payload.razorpay_signature,
    status: "CAPTURED",
  });
  await Order.update({ status: "PAID" }, { where: { id: payload.orderId } });
  return { ok: true, data: { verified: true, orderId: payload.orderId } };
}

module.exports = { createRazorpayOrder, verifyAndCapture };

