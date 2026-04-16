const { ok, fail } = require("../../utils/response");
const { createOrderSchema, verifySchema } = require("./payments.validators");
const paymentsService = require("./payments.service");

async function createOrder(req, res) {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await paymentsService.createRazorpayOrder(parsed.data.orderId);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function verify(req, res) {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await paymentsService.verifyAndCapture(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function webhook(req, res) {
  // Note: For Razorpay, req.body should be validated against razorpay-signature header.
  // Using a simplified signature check for the webhook payload.
  const signature = req.headers["x-razorpay-signature"];
  if (!signature) return fail(res, 400, "Missing signature");
  
  const result = await paymentsService.handleWebhook(req.body, signature);
  if (!result.ok) return fail(res, result.status, result.message);
  
  return ok(res, { received: true });
}

module.exports = { createOrder, verify, webhook };

