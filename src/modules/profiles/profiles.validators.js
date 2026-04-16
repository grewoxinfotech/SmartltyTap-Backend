const { z } = require("zod");

const updateProfileSchema = z.object({
  userId: z.string().min(1),
  name: z.string().max(100).optional(),
  businessName: z.string().max(100).optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  whatsapp: z.string().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  googleReview: z.string().url().optional().or(z.literal("")),
  template: z.string().min(1).optional(),
  branding: z.object({
    logoUrl: z.string().url().optional(),
    primary: z.string().min(3).optional(),
    secondary: z.string().min(3).optional(),
  }).optional(),
  mode: z.enum(["DIRECT", "SMART"]).optional(),
});

module.exports = { updateProfileSchema };
