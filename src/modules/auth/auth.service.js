const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const authModel = require("./auth.model");
const { sendResetPasswordEmail } = require("../../utils/email");

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
  const token = jwt.sign({ id, role: "USER" }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return { ok: true, data: { user: { id, name, email, role: "USER" }, token } };
}

async function login({ email, password }) {
  const user = await authModel.findUserWithPasswordByEmail(email);
  if (!user) return { ok: false, status: 401, message: "Invalid credentials" };
  if (!user.is_active) return { ok: false, status: 403, message: "Account disabled" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Invalid credentials" };

  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return {
    ok: true,
    data: { user: { id: user.id, name: user.name, email: user.email, role: user.role, plan: user.plan }, token },
  };
}

async function forgotPassword({ email }) {
  const user = await authModel.findUserByEmail(email);
  // Always return ok to prevent email enumeration
  if (!user) return { ok: true, data: { sent: true } };

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await authModel.setResetToken(user.id, token, expires);

  const resetLink = `${env.appBaseUrl}/reset-password?token=${token}`;
  try {
    await sendResetPasswordEmail(email, resetLink);
  } catch (err) {
    console.error("Email send failed:", err.message);
    // Don't fail the request if SMTP is not configured
  }

  return { ok: true, data: { sent: true } };
}

async function resetPassword({ token, password }) {
  const user = await authModel.findByResetToken(token);
  if (!user) return { ok: false, status: 400, message: "Invalid or expired reset token" };

  if (new Date() > new Date(user.reset_token_expires)) {
    return { ok: false, status: 400, message: "Reset token has expired" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await authModel.updatePassword(user.id, passwordHash);
  await authModel.clearResetToken(user.id);

  return { ok: true, data: { reset: true } };
}

async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await authModel.findUserWithPasswordById(userId);
  if (!user) return { ok: false, status: 404, message: "User not found" };

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Current password is incorrect" };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await authModel.updatePassword(userId, passwordHash);
  return { ok: true, data: { changed: true } };
}

async function updateEmail({ userId, newEmail, password }) {
  const user = await authModel.findUserWithPasswordById(userId);
  if (!user) return { ok: false, status: 404, message: "User not found" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Password is incorrect" };

  const existing = await authModel.findUserByEmail(newEmail);
  if (existing) return { ok: false, status: 409, message: "Email already in use" };

  await authModel.updateEmail(userId, newEmail);
  return { ok: true, data: { updated: true } };
}

module.exports = { signup, login, forgotPassword, resetPassword, changePassword, updateEmail };
