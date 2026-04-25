const templatesRepository = require("./templates.repository");
const { Profile, Settings } = require("../../models");

function filterTemplatesByBusinessType(templates, businessType) {
  if (!businessType) return templates;
  const lookup = businessType.toLowerCase();
  return templates.filter((template) => {
    const config = template.layout_config || {};
    const supported = config.businessTypes || config.business_types || [];
    if (!Array.isArray(supported) || supported.length === 0) return true;
    return supported.some((value) => String(value).toLowerCase() === lookup);
  });
}

async function getAllTemplates({ businessType } = {}) {
  const activeCount = await templatesRepository.countActiveTemplates();
  const templates = await templatesRepository.listAllActive();
  const filtered = filterTemplatesByBusinessType(templates, businessType);
  return {
    ok: true,
    data: {
      templates: filtered,
      meta: {
        activeCount,
      },
    },
  };
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
  const existing = await templatesRepository.findById(id);
  if (!existing) return { ok: false, status: 404, message: "Template not found" };

  const template = await templatesRepository.update(id, data);
  if (!template) return { ok: false, status: 404, message: "Template not found" };
  return { ok: true, data: template };
}

async function assignTemplateToUser(userId, templateId, businessType) {
  const template = await templatesRepository.findById(templateId);
  if (!template || !template.is_active) {
    return { ok: false, status: 400, message: "Invalid or inactive template" };
  }

  const profile = await Profile.findOne({ where: { user_id: userId } });
  if (!profile) return { ok: false, status: 404, message: "Profile not found" };

  const selectedBusinessType = businessType || profile.title || null;
  const matchesBusinessType = filterTemplatesByBusinessType([template], selectedBusinessType).length > 0;
  if (!matchesBusinessType) {
    return { ok: false, status: 400, message: "Template is not available for this business type" };
  }

  profile.template = templateId;
  await profile.save();
  return { ok: true, data: profile };
}

async function getThemeOptions(userId) {
  const [activeCount, templates, profile, settings] = await Promise.all([
    templatesRepository.countActiveTemplates(),
    templatesRepository.listAllActive(),
    Profile.findOne({ where: { user_id: userId }, attributes: ["template", "title"] }),
    Settings.findOne({ attributes: ["branding"] }),
  ]);

  const businessType = profile?.title || null;
  const filteredTemplates = filterTemplatesByBusinessType(templates, businessType);
  const defaultTemplateId = settings?.branding?.default_template_id || null;
  return {
    ok: true,
    data: {
      templates: filteredTemplates,
      selectedTemplateId: profile?.template || defaultTemplateId,
      defaultTemplateId,
      activeCount,
      businessType,
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
