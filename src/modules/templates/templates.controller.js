const { ok, fail } = require("../../utils/response");
const templatesService = require("./templates.service");

const getTemplates = async (req, res) => {
  const result = await templatesService.getAllTemplates({ businessType: req.query.businessType });
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
};

const createTemplate = async (req, res) => {
  const { name } = req.body;
  if (!name) return fail(res, 400, "Name is required");
  const result = await templatesService.createTemplate(req.body);
  return ok(res, result.data);
};

const updateTemplate = async (req, res) => {
  const result = await templatesService.updateTemplate(req.params.id, req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
};

const assignTemplate = async (req, res) => {
  const { userId, templateId, businessType } = req.body;
  if (!userId || !templateId) return fail(res, 400, "userId and templateId are required");
  const result = await templatesService.assignTemplateToUser(userId, templateId, businessType);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
};

const getMyThemeOptions = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, "Unauthenticated");
  const result = await templatesService.getThemeOptions(userId);
  return ok(res, result.data);
};

const selectMyTheme = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return fail(res, 401, "Unauthenticated");
  const { templateId, businessType } = req.body || {};
  if (!templateId) return fail(res, 400, "templateId is required");
  const result = await templatesService.assignTemplateToUser(userId, templateId, businessType);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, { selectedTemplateId: templateId });
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
  assignTemplate,
  getMyThemeOptions,
  selectMyTheme,
};
