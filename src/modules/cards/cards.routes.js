const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const controller = require("./cards.controller");

const router = Router();

// Admin create card for user (required)
router.post("/create", requireAuth, requireRole(["ADMIN"]), controller.create);

// User cards (required)
router.get("/:userId", requireAuth, controller.listByUser);

// Activate/deactivate (required)
router.patch("/:cardId/status", requireAuth, requireRole(["ADMIN"]), controller.status);

module.exports = router;

