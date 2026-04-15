const { z } = require("zod");

const updateProfileSchema = z.object({
  userId: z.string().min(1),
  links: z.object({
    google: z.string().url().optional(),
    whatsapp: z.string().url().optional(),
    instagram: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
  template: z.string().min(1).optional(),
  branding: z.object({
    logoUrl: z.string().url().optional(),
    primary: z.string().min(3).optional(),
    secondary: z.string().min(3).optional(),
  }).optional(),
  mode: z.enum(["DIRECT", "SMART"]).optional(),
});

module.exports = { updateProfileSchema };

