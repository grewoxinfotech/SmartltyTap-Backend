const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be >= 0"),
  stock: z.number().int().min(0, "Stock must be >= 0").optional().default(0),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be >= 0").optional(),
  stock: z.number().int().min(0, "Stock must be >= 0").optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable(),
});

module.exports = { createProductSchema, updateProductSchema };

