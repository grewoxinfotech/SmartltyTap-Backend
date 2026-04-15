const { Router } = require("express");
const { requireAuth } = require("../../middleware/auth");
const controller = require("./cart.controller");

const router = Router();

router.post("/add", requireAuth, controller.add);
router.post("/remove", requireAuth, controller.remove);
router.get("/:userId", requireAuth, controller.get);

module.exports = router;

