const { Router } = require("express");
const { getSettings, updateSettings } = require("./settings.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();

router.get("/", requireAuth, getSettings);
router.post("/update", requireAuth, requireRole(["ADMIN"]), updateSettings);

module.exports = router;
