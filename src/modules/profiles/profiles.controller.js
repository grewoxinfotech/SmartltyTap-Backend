const { ok, fail } = require("../../utils/response");
const { updateProfileSchema } = require("./profiles.validators");
const profilesService = require("./profiles.service");

async function update(req, res) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await profilesService.updateProfile(parsed.data);
  return ok(res, result.data);
}

async function get(req, res) {
  const result = await profilesService.getProfile(req.params.userId);
  return ok(res, result.data);
}

module.exports = { update, get };

