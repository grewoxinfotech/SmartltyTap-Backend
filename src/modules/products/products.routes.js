const { Router } = require("express");
const controller = require("./products.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();

router.get("/", controller.list);
router.post("/", requireAuth, requireRole(["ADMIN"]), controller.create);

module.exports = router;

