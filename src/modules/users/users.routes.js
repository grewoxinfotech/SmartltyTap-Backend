const { Router } = require("express");
const { requireAuth, requireRole } = require("../../middleware/auth");
const controller = require("./users.controller");

const router = Router();

// Dashboard Admin routes
router.get("/", requireAuth, requireRole(["ADMIN"]), controller.listUsers);
router.post("/", requireAuth, requireRole(["SUPER_ADMIN"]), controller.createUser);
router.patch("/:id/plan", requireAuth, requireRole(["ADMIN"]), controller.updatePlan);
router.patch("/:id/status", requireAuth, requireRole(["ADMIN"]), controller.updateStatus);
router.patch("/:id/reset-password", requireAuth, requireRole(["SUPER_ADMIN"]), controller.resetPassword);
router.patch("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), controller.updateUser);
router.delete("/:id", requireAuth, requireRole(["SUPER_ADMIN"]), controller.deleteUser);

module.exports = router;
