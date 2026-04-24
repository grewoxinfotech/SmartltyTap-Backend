const { ok, fail } = require("../../utils/response");
const billingService = require("./billing.service");
const { z } = require("zod");

async function payInvoice(req, res) {
  const result = await billingService.initiateInvoicePayment(req.params.id, req.user.id);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function markPaid(req, res) {
  const schema = z.object({ note: z.string().max(500).optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await billingService.markInvoicePaid(req.params.id, parsed.data.note);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = {
  payInvoice,
  markPaid,
};
