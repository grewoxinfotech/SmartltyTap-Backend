const usersRepository = require("./users.repository");
const bcrypt = require("bcryptjs");

async function listUsers() {
  const users = await usersRepository.listUsers();
  return { ok: true, data: users };
}

async function createUser(data) {
  // Use the ID generator if it's not provided or let the model handle it if sync'd.
  // Actually, let's keep the manual one if preferred, but usually model handle it.
  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await usersRepository.create({
    name: data.name,
    email: data.email,
    password_hash: passwordHash,
    role: data.role,
    plan: data.plan,
    is_active: data.is_active,
  });

  return { ok: true, data: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

async function updatePlan(id, plan) {
  const user = await usersRepository.update(id, { plan });
  if (!user) return { ok: false, status: 404, message: "User not found" };
  return { ok: true, data: { id, plan: user.plan } };
}

async function updateStatus(id, isActive) {
  const user = await usersRepository.update(id, { is_active: isActive });
  if (!user) return { ok: false, status: 404, message: "User not found" };
  return { ok: true, data: { id, isActive: user.is_active } };
}

async function resetPassword(id, newPassword) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = await usersRepository.update(id, { 
    password_hash: passwordHash,
    reset_token: null,
    reset_token_expires: null
  });
  if (!user) return { ok: false, status: 404, message: "User not found" };
  return { ok: true, data: { id, reset: true } };
}

async function updateUser(id, data) {
  const updateData = { ...data };
  
  const user = await usersRepository.update(id, updateData);
  if (!user) return { ok: false, status: 404, message: "User not found" };
  return { ok: true, data: { id, updated: true } };
}

async function deleteUser(id) {
  const user = await usersRepository.update(id, { is_active: false });
  if (!user) return { ok: false, status: 404, message: "User not found" };
  return { ok: true, data: { id, deleted: true } };
}

module.exports = {
  listUsers,
  createUser,
  updatePlan,
  updateStatus,
  resetPassword,
  updateUser,
  deleteUser,
};
