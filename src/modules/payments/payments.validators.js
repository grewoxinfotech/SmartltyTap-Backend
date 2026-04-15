const { z } = require("zod");

const createOrderSchema = z.object({
  orderId: z.string().min(1),
});

const verifySchema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

module.exports = { createOrderSchema, verifySchema };

