const templatesRepository = require("./templates.repository");
const { Profile, Settings } = require("../../models");

async function getAllTemplates() {
  const templates = await templatesRepository.listAllActive();
  return { ok: true, data: templates };
}

async function createTemplate(data) {
  const template = await templatesRepository.create({
    name: data.name,
    layout_config: data.layout_config || {},
    preview_image: data.preview_image,
  });
  return { ok: true, data: template };
}

async function updateTemplate(id, data) {
  const template = await templatesRepository.update(id, data);
  if (!template) return { ok: false, status: 404, message: "Template not found" };
  return { ok: true, data: template };
}

async function assignTemplateToUser(userId, templateId) {
  const template = await templatesRepository.findById(templateId);
  if (!template || !template.is_active) {
    return { ok: false, status: 400, message: "Invalid or inactive template" };
  }

  const profile = await Profile.findOne({ where: { user_id: userId } });
  if (!profile) return { ok: false, status: 404, message: "Profile not found" };

  profile.template = templateId;
  await profile.save();
  return { ok: true, data: profile };
}

async function getThemeOptions(userId) {
  const [templates, profile, settings] = await Promise.all([
    templatesRepository.listAllActive(),
    Profile.findOne({ where: { user_id: userId }, attributes: ["template"] }),
    Settings.findOne({ attributes: ["branding"] }),
  ]);

  const defaultTemplateId = settings?.branding?.default_template_id || null;
  return {
    ok: true,
    data: {
      templates,
      selectedTemplateId: profile?.template || defaultTemplateId,
      defaultTemplateId,
    }
  };
}

module.exports = {
  getAllTemplates,
  createTemplate,
  updateTemplate,
  assignTemplateToUser,
  getThemeOptions,
};
