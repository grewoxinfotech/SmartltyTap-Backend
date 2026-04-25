const { z } = require("zod");

const updateProfileSchema = z.object({
  userId: z.string().min(1).optional(),
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
  gallery: z.array(z.string().url()).max(50).optional(),
  brochure: z
    .object({
      url: z.string().url(),
      name: z.string().max(200).optional(),
    })
    .optional(),
  portfolio: z
    .array(
      z.object({
        title: z.string().max(200),
        description: z.string().max(2000).optional(),
        link: z.string().url().optional(),
        images: z.array(z.string().url()).max(20).optional(),
      })
    )
    .max(100)
    .optional(),
  testimonials: z
    .array(
      z.object({
        name: z.string().max(100),
        text: z.string().max(2000),
        rating: z.number().min(1).max(5).optional(),
      })
    )
    .max(100)
    .optional(),
  branding: z.object({
    logoUrl: z.string().url().optional(),
    primary: z.string().min(3).optional(),
    secondary: z.string().min(3).optional(),
  }).optional(),
  mode: z.enum(["DIRECT", "SMART"]).optional(),
});

module.exports = { updateProfileSchema };
