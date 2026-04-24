const { ok, fail } = require("../../utils/response");
const { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updateEmailSchema } = require("./auth.validators");
const authService = require("./auth.service");
const { isSignupDisabled } = require("../../middleware/apiControl");

async function signup(req, res) {
  if (await isSignupDisabled()) return fail(res, 403, "Signup is disabled");
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.signup(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.login(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function forgotPassword(req, res) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.forgotPassword(parsed.data);
  return ok(res, result.data);
}

async function resetPassword(req, res) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.resetPassword(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function changePassword(req, res) {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.changePassword({ ...parsed.data, userId: req.user.id });
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function updateEmail(req, res) {
  const parsed = updateEmailSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await authService.updateEmail({ ...parsed.data, userId: req.user.id });
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function sendOtp(req, res) {
  const { email } = req.body;
  if (!email) return fail(res, 400, "Email is required");
  const result = await authService.requestOtp(email);
  return ok(res, result.data);
}

async function verifyOtp(req, res) {
  const { email, code } = req.body;
  if (!email || !code) return fail(res, 400, "Email and code are required");
  const result = await authService.loginWithOtp(email, code);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = { signup, login, forgotPassword, resetPassword, changePassword, updateEmail, sendOtp, verifyOtp };
