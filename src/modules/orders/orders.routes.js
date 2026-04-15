const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./orders.controller");

const router = Router();

router.post("/create", requireAuth, controller.create);
router.get("/:userId", requireAuth, controller.list);
router.get("/details/:orderId", requireAuth, controller.details);

module.exports = router;

