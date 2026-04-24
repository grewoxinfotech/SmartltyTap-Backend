const profilesRepository = require("./profiles.repository");

function mapProfile(profile) {
  if (!profile) return null;
  return {
    id: profile.id,
    userId: profile.user_id,
    name: profile.name,
    businessName: profile.business_name,
    title: profile.title,
    bio: profile.bio,
    profileImage: profile.profile_image,
    phone: profile.phone,
    whatsapp: profile.whatsapp,
    instagram: profile.instagram,
    website: profile.website,
    googleReview: profile.google_review,
    template: profile.template,
    mode: profile.mode,
    gallery: profile.gallery || [],
    portfolio: profile.portfolio || [],
    testimonials: profile.testimonials || [],
    brochure: profile.brochure_url ? { url: profile.brochure_url, name: profile.brochure_name } : null,
    branding: {
      logoUrl: profile.logo_url,
      primary: profile.brand_primary,
      secondary: profile.brand_secondary,
    }
  };
}

async function updateProfile(payload) {
  await profilesRepository.upsertProfile({
    userId: payload.userId,
    name: payload.name,
    business_name: payload.businessName,
    title: payload.title,
    bio: payload.bio,
    profile_image: payload.profileImage,
    phone: payload.phone,
    whatsapp: payload.whatsapp,
    instagram: payload.instagram,
    website: payload.website,
    google_review: payload.googleReview,
    template: payload.template,
    mode: payload.mode,
    logo_url: payload.branding?.logoUrl,
    brand_primary: payload.branding?.primary,
    brand_secondary: payload.branding?.secondary,
    gallery: payload.gallery,
    portfolio: payload.portfolio,
    testimonials: payload.testimonials,
    brochure_url: payload.brochure?.url,
    brochure_name: payload.brochure?.name,
  });

  const map = [
    ["GOOGLE", payload.googleReview],
    ["WHATSAPP", payload.whatsapp],
    ["INSTAGRAM", payload.instagram],
    ["WEBSITE", payload.website],
  ];
  for (const [platform, url] of map) {
    if (url !== undefined) {
      // eslint-disable-next-line no-await-in-loop
      await profilesRepository.setLink(payload.userId, platform, url);
    }
  }

  const full = await profilesRepository.getProfile(payload.userId);
  return { ok: true, data: { profile: mapProfile(full.profile), links: full.links } };
}

async function getProfile(userId) {
  const full = await profilesRepository.getProfile(userId);
  return { ok: true, data: { profile: mapProfile(full.profile), links: full.links } };
}

async function listProfiles() {
  const profiles = await profilesRepository.listProfiles();
  return { ok: true, data: profiles.map(mapProfile) };
}

module.exports = { updateProfile, getProfile, listProfiles };
