const { Router } = require("express");
const { getTemplates, createTemplate, updateTemplate, assignTemplate, getMyThemeOptions, selectMyTheme } = require("./templates.controller");
const { requireAuth, requireRole } = require("../../middleware/auth");

const router = Router();

router.get("/", getTemplates);
router.get("/my-options", requireAuth, getMyThemeOptions);
router.post("/my-select", requireAuth, selectMyTheme);
router.post("/create", requireAuth, requireRole(["ADMIN"]), createTemplate);
router.patch("/:id", requireAuth, requireRole(["ADMIN"]), updateTemplate);
router.post("/assign", requireAuth, assignTemplate);

module.exports = router;
