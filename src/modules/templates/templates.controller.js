const { Template, Profile } = require("../../models");
const { successResponse, errorResponse } = require("../../utils/response");

const getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({ where: { is_active: true } });
    return successResponse(res, "Templates fetched successfully", templates);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const createTemplate = async (req, res) => {
  try {
    const { name, layout_config, preview_image } = req.body;
    if (!name) {
      return errorResponse(res, "Name is required", 400);
    }
    
    const newTemplate = await Template.create({
      name,
      layout_config: layout_config || {},
      preview_image,
    });

    return successResponse(res, "Template created successfully", newTemplate, 201);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const template = await Template.findByPk(id);
    if (!template) {
      return errorResponse(res, "Template not found", 404);
    }

    await template.update(updateData);
    return successResponse(res, "Template updated successfully", template);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

const assignTemplate = async (req, res) => {
  try {
    const { userId, templateId } = req.body;
    if (!userId || !templateId) {
      return errorResponse(res, "userId and templateId are required", 400);
    }

    const template = await Template.findByPk(templateId);
    if (!template || !template.is_active) {
      return errorResponse(res, "Invalid or inactive template", 400);
    }

    const profile = await Profile.findOne({ where: { user_id: userId } });
    if (!profile) {
      return errorResponse(res, "Profile not found for this user", 404);
    }

    // Assign the template id explicitly to the `template` string field in Profile model
    profile.template = templateId;
    await profile.save();

    return successResponse(res, "Template assigned successfully", profile);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
  assignTemplate,
};
