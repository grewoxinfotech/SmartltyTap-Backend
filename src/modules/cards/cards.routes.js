const { Router } = require("express");
const { requireAuth, requireRole, requireSelfOrAdmin } = require("../../middleware/auth");
const controller = require("./cards.controller");
const multer = require("multer");

const router = Router();
const upload = multer({ dest: "uploads/" }); // Temp storage for CSV

// Admin create card for user (required)
router.post("/create", requireAuth, requireRole(["ADMIN"]), controller.create);

// Bulk upload CSV (required)
router.post("/bulk-upload", requireAuth, requireRole(["ADMIN"]), upload.single("file"), controller.bulkUpload);

// Assign card
router.post("/assign", requireAuth, requireRole(["ADMIN"]), controller.assign);

// Sell card and auto-create buyer credentials
router.post("/sell", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), controller.sell);

// Lost-card flow: disable old card, assign new card
router.post("/reassign", requireAuth, requireRole(["SUPER_ADMIN"]), controller.reassign);

// User cards (required)
router.get("/:userId", requireAuth, requireSelfOrAdmin("userId"), controller.listByUser);

// Activate/deactivate (required)
router.patch("/:id/status", requireAuth, requireRole(["ADMIN"]), controller.status);

// Update card metadata (e.g. batch_no)
router.patch("/:id", requireAuth, requireRole(["ADMIN"]), controller.update);

module.exports = router;

