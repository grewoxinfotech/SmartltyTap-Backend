const { Template } = require("../../models");

async function listAllActive() {
  return Template.findAll({ 
    where: { is_active: true },
    attributes: ["id", "name", "layout_config", "preview_image"],
    order: [["created_at", "DESC"]],
  });
}

async function findById(id) {
  return Template.findByPk(id);
}

async function create(data) {
  return Template.create(data);
}

async function update(id, data) {
  const template = await Template.findByPk(id);
  if (!template) return null;
  return template.update(data);
}

module.exports = {
  listAllActive,
  findById,
  create,
  update,
};
