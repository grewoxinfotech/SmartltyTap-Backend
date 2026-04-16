const { Router } = require("express");
const controller = require("./profiles.controller");
const { requireAuth } = require("../../middleware/auth");

const router = Router();

router.put("/update", requireAuth, controller.update);
router.post("/update", requireAuth, controller.update); // Keep post for compatibility
router.get("/:userId", requireAuth, controller.get);

module.exports = router;

