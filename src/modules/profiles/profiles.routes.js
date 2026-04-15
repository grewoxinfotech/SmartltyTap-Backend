const { Router } = require("express");
const controller = require("./profiles.controller");
const { requireAuth } = require("../../middleware/auth");

const router = Router();

router.post("/update", requireAuth, controller.update);
router.get("/:userId", requireAuth, controller.get);

module.exports = router;

