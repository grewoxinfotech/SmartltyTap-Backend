const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const controller = require("./subscriptions.controller");

const router = Router();

router.get("/plans", requireAuth, controller.getPlans);
router.post("/plans", requireAuth, requireRole(["SUPER_ADMIN"]), controller.upsertPlan);
router.post("/assign", requireAuth, requireRole(["SUPER_ADMIN"]), controller.assign);
router.get("/users/:userId", requireAuth, controller.getUserSubscription);
router.post("/invoices", requireAuth, requireRole(["SUPER_ADMIN"]), controller.createInvoice);
router.get("/invoices", requireAuth, requireRole(["SUPER_ADMIN"]), controller.listInvoices);
router.patch("/invoices/:id/status", requireAuth, requireRole(["SUPER_ADMIN"]), controller.updateInvoiceStatus);

module.exports = router;
