const crypto = require("crypto");
const { Invoice } = require("../../models");

async function initiateInvoicePayment(invoiceId, userId) {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) return { ok: false, status: 404, message: "Invoice not found" };
  if (String(invoice.user_id) !== String(userId)) return { ok: false, status: 403, message: "Forbidden" };
  if (invoice.status === "PAID") return { ok: true, data: { paid: true } };

  const reference = `invpay_${crypto.randomBytes(8).toString("hex")}`;
  return {
    ok: true,
    data: {
      invoiceId: invoice.id,
      reference,
      amount: invoice.amount,
      currency: invoice.currency,
      status: "CREATED",
    }
  };
}

async function markInvoicePaid(invoiceId, note) {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) return { ok: false, status: 404, message: "Invoice not found" };
  
  await invoice.update({ 
    status: "PAID", 
    paid_at: new Date(), 
    notes: note || invoice.notes 
  });
  
  return { ok: true, data: { id: invoice.id, status: invoice.status } };
}

module.exports = {
  initiateInvoicePayment,
  markInvoicePaid,
};
