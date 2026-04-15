const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const authModel = require("./auth.model");

async function signup({ name, email, password }) {
  const existing = await authModel.findUserByEmail(email);
  if (existing) return { ok: false, status: 409, message: "Email already exists" };

  const passwordHash = await bcrypt.hash(password, 10);
  const id = `USR-${Date.now()}`;
  await authModel.insertUser({
    id,
    name,
    email,
    passwordHash,
    role: "USER",
    plan: "BASIC",
    isActive: 1,
  });
  const token = jwt.sign({ id, role: "USER" }, env.jwtSecret, { expiresIn: "7d" });
  return { ok: true, data: { user: { id, name, email, role: "USER" }, token } };
}

async function login({ email, password }) {
  const user = await authModel.findUserWithPasswordByEmail(email);
  if (!user) return { ok: false, status: 401, message: "Invalid credentials" };
  if (!user.is_active) return { ok: false, status: 403, message: "Account disabled" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Invalid credentials" };

  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: "7d" });
  return {
    ok: true,
    data: { user: { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan }, token },
  };
}

module.exports = { signup, login };

