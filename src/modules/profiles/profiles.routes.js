const { Router } = require("express");
const controller = require("./profiles.controller");
const { requireAuth, requireRole, requireSelfOrAdmin } = require("../../middleware/auth");

const router = Router();

router.get("/", requireAuth, requireRole(["ADMIN", "SUPER_ADMIN"]), controller.list);
router.get("/me", requireAuth, controller.get);
router.put("/update", requireAuth, controller.update);
router.post("/update", requireAuth, controller.update);
router.get("/:userId", requireAuth, requireSelfOrAdmin("userId"), controller.get);
router.get("/:userId/vcard", controller.exportVCard); 

module.exports = router;
