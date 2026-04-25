const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const authRepository = require("./auth.repository");
const { sendResetPasswordEmail, sendOtpEmail } = require("../../utils/email");
const otpService = require("./otp.service");

async function signup({ name, email, password }) {
  const existing = await authRepository.findUserByEmail(email);
  if (existing) return { ok: false, status: 409, message: "Email already exists" };

  const passwordHash = await bcrypt.hash(password, 10);
  const id = `USR-${Date.now()}`;
  await authRepository.insertUser({
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
  const envUser = (env.envUsers || []).find((user) => user?.email === email && user?.password === password);
  if (envUser) {
    let user = await authRepository.findUserWithPasswordByEmail(email);
    if (!user) {
      user = await authRepository.insertUser({
        id: envUser.id || `ENV-${email}`,
        name: envUser.name || "Env User",
        email: envUser.email,
        passwordHash: "ENV_MANAGED",
        role: envUser.role || "ADMIN",
        plan: envUser.plan || "BASIC",
        isActive: 1,
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
    return {
      ok: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
        },
        token,
      },
    };
  }

  const user = await authRepository.findUserWithPasswordByEmail(email);
  if (!user) return { ok: false, status: 401, message: "Invalid credentials" };
  if (!user.is_active) return { ok: false, status: 403, message: "Account disabled" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Invalid credentials" };

  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        must_reset_password: user.reset_token === "FORCE_RESET",
      },
      token,
    },
  };
}

async function forgotPassword({ email }) {
  const user = await authRepository.findUserByEmail(email);
  // Always return ok to prevent email enumeration
  if (!user) return { ok: true, data: { sent: true } };

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await authRepository.setResetToken(user.id, token, expires);

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
  const user = await authRepository.findByResetToken(token);
  if (!user) return { ok: false, status: 400, message: "Invalid or expired reset token" };

  if (new Date() > new Date(user.reset_token_expires)) {
    return { ok: false, status: 400, message: "Reset token has expired" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await authRepository.updatePassword(user.id, passwordHash);
  await authRepository.clearResetToken(user.id);

  return { ok: true, data: { reset: true } };
}

async function changePassword({ userId, currentPassword, newPassword }) {
  const user = await authRepository.findUserWithPasswordById(userId);
  if (!user) return { ok: false, status: 404, message: "User not found" };

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Current password is incorrect" };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await authRepository.updatePassword(userId, passwordHash);
  await authRepository.clearResetToken(userId);
  return { ok: true, data: { changed: true } };
}

async function updateEmail({ userId, newEmail, password }) {
  const user = await authRepository.findUserWithPasswordById(userId);
  if (!user) return { ok: false, status: 404, message: "User not found" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return { ok: false, status: 401, message: "Password is incorrect" };

  const existing = await authRepository.findUserByEmail(newEmail);
  if (existing) return { ok: false, status: 409, message: "Email already in use" };

  await authRepository.updateEmail(userId, newEmail);
  return { ok: true, data: { updated: true } };
}

async function requestOtp(email) {
  const code = otpService.generateOtp(email);
  try {
    await sendOtpEmail(email, code);
  } catch (err) {
    console.error("OTP Email failed:", err.message);
  }
  return { ok: true, data: { sent: true } };
}

async function loginWithOtp(email, code) {
  const valid = otpService.verifyOtp(email, code);
  if (!valid) return { ok: false, status: 401, message: "Invalid or expired OTP" };

  const user = await authRepository.findUserByEmail(email);
  if (!user) return { ok: false, status: 404, message: "Account not found" };

  const token = jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return { ok: true, data: { user, token } };
}

module.exports = { signup, login, forgotPassword, resetPassword, changePassword, updateEmail, requestOtp, loginWithOtp };
