const { ok, fail } = require("../../utils/response");
const { updatePlanSchema, updateStatusSchema } = require("./users.validators");
const usersService = require("./users.service");

async function listUsers(req, res) {
  const result = await usersService.listUsers();
  return ok(res, result);
}

async function updatePlan(req, res) {
  const parsed = updatePlanSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await usersService.updatePlan(req.params.id, parsed.data.plan);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

async function updateStatus(req, res) {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await usersService.updateStatus(req.params.id, parsed.data.isActive);
  if (!result.ok) return fail(res, result.status, result.message);
  return ok(res, result.data);
}

module.exports = { listUsers, updatePlan, updateStatus };

