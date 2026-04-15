const { User } = require("../../models");

async function findUserByEmail(email) {
  return User.findOne({ where: { email }, attributes: ["id"] });
}

async function findUserWithPasswordByEmail(email) {
  return User.findOne({
    where: { email },
    attributes: ["id", "name", "email", "password_hash", "role", "plan", "is_active"],
  });
}

async function insertUser({ id, name, email, passwordHash, role, plan, isActive }) {
  await User.create({
    id,
    name,
    email,
    password_hash: passwordHash,
    role,
    plan,
    is_active: Boolean(isActive),
  });
}

module.exports = { findUserByEmail, findUserWithPasswordByEmail, insertUser };

