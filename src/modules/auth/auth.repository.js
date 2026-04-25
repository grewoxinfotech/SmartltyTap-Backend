const { User } = require("../../models");
const { Op } = require("sequelize");

async function findUserByEmail(email) {
  return User.findOne({ where: { email }, attributes: ["id", "email"] });
}

async function findUserWithPasswordByEmail(email) {
  return User.findOne({
    where: { email },
    attributes: ["id", "name", "email", "password_hash", "role", "plan", "is_active", "reset_token"],
  });
}

async function findUserWithPasswordById(id) {
  return User.findOne({
    where: { id },
    attributes: ["id", "name", "email", "password_hash", "role", "plan", "is_active", "reset_token"],
  });
}

async function insertUser({ id, name, email, passwordHash, role, plan, isActive }) {
  return User.create({
    id,
    name,
    email,
    password_hash: passwordHash,
    role,
    plan,
    is_active: Boolean(isActive),
  });
}

async function setResetToken(userId, token, expires) {
  await User.update(
    { reset_token: token, reset_token_expires: expires },
    { where: { id: userId } }
  );
}

async function findByResetToken(token) {
  return User.findOne({
    where: { reset_token: token },
    attributes: ["id", "email", "reset_token_expires"],
  });
}

async function clearResetToken(userId) {
  await User.update(
    { reset_token: null, reset_token_expires: null },
    { where: { id: userId } }
  );
}

async function updatePassword(userId, passwordHash) {
  await User.update({ password_hash: passwordHash }, { where: { id: userId } });
}

async function updateEmail(userId, newEmail) {
  await User.update({ email: newEmail }, { where: { id: userId } });
}

module.exports = {
  findUserByEmail,
  findUserWithPasswordByEmail,
  findUserWithPasswordById,
  insertUser,
  setResetToken,
  findByResetToken,
  clearResetToken,
  updatePassword,
  updateEmail,
};
