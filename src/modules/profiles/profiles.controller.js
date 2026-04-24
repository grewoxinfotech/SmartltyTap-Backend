const { ok, fail } = require("../../utils/response");
const { updateProfileSchema } = require("./profiles.validators");
const profilesService = require("./profiles.service");
const vcardService = require("./vcard.service");

async function update(req, res) {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid payload");
  const result = await profilesService.updateProfile({ ...parsed.data, userId: req.user.id });
  return ok(res, result.data);
}

async function get(req, res) {
  const result = await profilesService.getProfile(req.params.userId || req.user.id);
  return ok(res, result.data);
}

async function list(req, res) {
  const result = await profilesService.listProfiles();
  return ok(res, result.data);
}

async function exportVCard(req, res) {
  const result = await profilesService.getProfile(req.params.userId);
  if (!result.data || !result.data.profile) return fail(res, 404, "Profile not found");
  
  const vcf = vcardService.generateVCard(result.data.profile);
  res.setHeader("Content-Type", "text/vcard");
  res.setHeader("Content-Disposition", `attachment; filename="${result.data.profile.name || 'contact'}.vcf"`);
  return res.status(200).send(vcf);
}

module.exports = { update, get, exportVCard, list };
