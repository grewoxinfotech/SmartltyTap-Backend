const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const controller = require("./billing.controller");

const router = Router();

router.post("/invoice/:id/pay", requireAuth, controller.payInvoice);
router.patch("/invoice/:id/mark-paid", requireAuth, requireRole(["SUPER_ADMIN"]), controller.markPaid);

module.exports = router;
