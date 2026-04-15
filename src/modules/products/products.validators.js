const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
});

module.exports = { createProductSchema };

