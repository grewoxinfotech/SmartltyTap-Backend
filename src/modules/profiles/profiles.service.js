const profilesModel = require("./profiles.model");

async function updateProfile(payload) {
  const prof = await profilesModel.upsertProfile({
    userId: payload.userId,
    template: payload.template,
    branding: payload.branding,
    mode: payload.mode,
  });

  const links = payload.links || {};
  const map = [
    ["GOOGLE", links.google],
    ["WHATSAPP", links.whatsapp],
    ["INSTAGRAM", links.instagram],
    ["WEBSITE", links.website],
  ];
  for (const [platform, url] of map) {
    if (url) {
      // eslint-disable-next-line no-await-in-loop
      await profilesModel.setLink(payload.userId, platform, url);
    }
  }

  const full = await profilesModel.getProfile(payload.userId);
  return { ok: true, data: { profile: full.profile, links: full.links } };
}

async function getProfile(userId) {
  const full = await profilesModel.getProfile(userId);
  return { ok: true, data: { profile: full.profile, links: full.links } };
}

module.exports = { updateProfile, getProfile };

