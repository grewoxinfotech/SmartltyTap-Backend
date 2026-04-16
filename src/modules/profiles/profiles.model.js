const { Profile, Link } = require("../../models");

async function upsertProfile(data) {
  const [prof] = await Profile.upsert(
    {
      user_id: data.userId,
      name: data.name,
      business_name: data.business_name,
      title: data.title,
      bio: data.bio,
      profile_image: data.profile_image,
      phone: data.phone,
      whatsapp: data.whatsapp,
      instagram: data.instagram,
      website: data.website,
      google_review: data.google_review,
      template: data.template,
      mode: data.mode,
      logo_url: data.logo_url,
      brand_primary: data.brand_primary,
      brand_secondary: data.brand_secondary,
    },
    { returning: true }
  );
  return prof;
}

async function setLink(userId, platform, url) {
  const [link] = await Link.upsert(
    { user_id: userId, platform, url },
    { returning: true }
  );
  return link;
}

async function getProfile(userId) {
  const profile = await Profile.findOne({ where: { user_id: userId } });
  const links = await Link.findAll({ where: { user_id: userId } });
  return { profile, links };
}

module.exports = { upsertProfile, setLink, getProfile };
