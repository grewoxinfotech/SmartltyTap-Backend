const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
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

// User cards (required)
router.get("/:userId", requireAuth, controller.listByUser);

// Activate/deactivate (required)
router.patch("/:cardId/status", requireAuth, requireRole(["ADMIN"]), controller.status);

module.exports = router;

