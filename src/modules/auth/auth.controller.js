const { ok, fail } = require("../../utils/response");
const { signupSchema, loginSchema } = require("./auth.validators");
const authService = require("./auth.service");

async function signup(req, res) {
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

module.exports = { signup, login };

