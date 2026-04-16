const PDFDocument = require("pdfkit");
const { Order, User, Payment } = require("../models");

async function generateInvoicePDF(orderId, res) {
  const order = await Order.findByPk(orderId, {
    include: [User, Payment]
  });

  if (!order) {
    return res.status(404).json({ ok: false, message: "Order not found" });
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.id}.pdf`);

  doc.pipe(res);

  // Header
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("SmartlyTap", 50, 57)
    .fontSize(10)
    .text("SmartlyTap Technologies", 200, 50, { align: "right" })
    .text("contact@smartlytap.com", 200, 65, { align: "right" })
    .moveDown();

  // Invoice details
  doc
    .fillColor("#000000")
    .fontSize(20)
    .text("INVOICE", 50, 160);

  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 185).lineTo(550, 185).stroke();

  doc
    .fontSize(10)
    .text(`Invoice Number: INV-${order.id}`, 50, 200)
    .text(`Invoice Date: ${new Date(order.created_at).toLocaleDateString()}`, 50, 215)
    .text(`Order Status: ${order.status}`, 50, 230);

  // Customer details
  const customerName = order.User ? order.User.name : "Customer";
  const customerEmail = order.User ? order.User.email : "N/A";

  doc
    .text("Billed To:", 300, 200)
    .font("Helvetica-Bold")
    .text(customerName, 300, 215)
    .font("Helvetica")
    .text(customerEmail, 300, 230);

  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 250).lineTo(550, 250).stroke();

  // Table Header
  const tableTop = 280;
  doc.font("Helvetica-Bold");
  doc.text("Item", 50, tableTop);
  doc.text("Quantity", 300, tableTop, { width: 90, align: "right" });
  doc.text("Price", 400, tableTop, { width: 90, align: "right" });
  doc.text("Total", 0, tableTop, { align: "right" });
  
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 295).lineTo(550, 295).stroke();

  // Table Row
  doc.font("Helvetica");
  let position = 310;
  
  // Note: Since we don't have OrderItem fully populated yet, we'll show a generic row
  doc.text("SmartlyTap NFC Services/Products", 50, position);
  doc.text("1", 300, position, { width: 90, align: "right" });
  doc.text(`Rs. ${order.amount}`, 400, position, { width: 90, align: "right" });
  doc.text(`Rs. ${order.amount}`, 0, position, { align: "right" });

  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, position + 20).lineTo(550, position + 20).stroke();

  // Total
  doc.font("Helvetica-Bold");
  doc.text("Total Amount:", 380, position + 40);
  doc.text(`Rs. ${order.amount}`, 0, position + 40, { align: "right" });

  // Footer
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      "Thank you for your business. For any support, contact contact@smartlytap.com.",
      50,
      700,
      { align: "center", width: 500 }
    );

  doc.end();
}

module.exports = { generateInvoicePDF };