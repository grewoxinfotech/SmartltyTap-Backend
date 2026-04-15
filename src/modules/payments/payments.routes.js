const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./payments.controller");

const router = Router();

router.post("/create-order", requireAuth, controller.createOrder);
router.post("/verify", requireAuth, controller.verify);

module.exports = router;

