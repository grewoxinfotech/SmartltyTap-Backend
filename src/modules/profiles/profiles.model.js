const { Profile, Link } = require("../../models");

async function upsertProfile({ userId, template, branding, mode }) {
  const existing = await Profile.findOne({ where: { user_id: userId } });
  if (existing) {
    await existing.update({
      template: template ?? existing.template,
      mode: mode ?? existing.mode,
      logo_url: branding?.logoUrl ?? existing.logo_url,
      brand_primary: branding?.primary ?? existing.brand_primary,
      brand_secondary: branding?.secondary ?? existing.brand_secondary,
    });
    return existing;
  }
  return Profile.create({
    user_id: userId,
    template: template ?? "template-01",
    mode: mode ?? "SMART",
    logo_url: branding?.logoUrl ?? null,
    brand_primary: branding?.primary ?? "#4F46E5",
    brand_secondary: branding?.secondary ?? "#0ea5e9",
  });
}

async function setLink(userId, platform, url) {
  const existing = await Link.findOne({ where: { user_id: userId, platform } });
  if (existing) return existing.update({ url, is_enabled: true });
  return Link.create({ user_id: userId, platform, url, is_enabled: true });
}

async function getProfile(userId) {
  const profile = await Profile.findOne({ where: { user_id: userId } });
  const links = await Link.findAll({ where: { user_id: userId } });
  return { profile, links };
}

module.exports = { upsertProfile, setLink, getProfile };

