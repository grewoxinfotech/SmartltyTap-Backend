const { ok, fail } = require("../../utils/response");
const usersService = require("./users.service");
const { z } = require("zod");

async function listUsers(req, res) {
  const result = await usersService.listUsers();
  return ok(res, result.data);
}

async function createUser(req, res) {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["ADMIN", "USER", "RESELLER", "SUPER_ADMIN"]).default("USER"),
    plan: z.enum(["BASIC", "PREMIUM", "PRO", "FREE"]).default("BASIC"),
    is_active: z.boolean().optional().default(true),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await usersService.createUser(parsed.data);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function updatePlan(req, res) {
  const schema = z.object({ plan: z.enum(["BASIC", "PREMIUM"]) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await usersService.updatePlan(req.params.id, parsed.data.plan);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function updateStatus(req, res) {
  const schema = z.object({ isActive: z.boolean() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await usersService.updateStatus(req.params.id, parsed.data.isActive);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function resetPassword(req, res) {
  const schema = z.object({ newPassword: z.string().min(6) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");

  const result = await usersService.resetPassword(req.params.id, parsed.data.newPassword);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function updateUser(req, res) {
  const result = await usersService.updateUser(req.params.id, req.body);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function deleteUser(req, res) {
  const result = await usersService.deleteUser(req.params.id);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = { 
  listUsers, 
  createUser, 
  updatePlan, 
  updateStatus, 
  resetPassword, 
  updateUser, 
  deleteUser 
};
