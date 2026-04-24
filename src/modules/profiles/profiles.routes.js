const { Router } = require("express");
const controller = require("./profiles.controller");
const { requireAuth } = require("../../middleware/auth");

const router = Router();

router.get("/", requireAuth, controller.list);
router.get("/me", requireAuth, controller.get);
router.put("/update", requireAuth, controller.update);
router.post("/update", requireAuth, controller.update);
router.get("/:userId", requireAuth, controller.get);
router.get("/:userId/vcard", controller.exportVCard); 

module.exports = router;
