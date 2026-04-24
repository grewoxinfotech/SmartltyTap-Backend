const { User } = require("../../models");

async function listUsers() {
  return User.findAll({
    attributes: ["id", "name", "email", "role", "plan", "is_active"],
    order: [["created_at", "DESC"]],
  });
}

async function findById(id) {
  return User.findByPk(id);
}

async function create(data) {
  return User.create(data);
}

async function update(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  return user.update(data);
}

module.exports = {
  listUsers,
  findById,
  create,
  update,
};
