const { z } = require("zod");

const addToCartSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(100).default(1),
});

const removeFromCartSchema = z.object({
  userId: z.string().min(1),
  productId: z.string().min(1),
});

module.exports = { addToCartSchema, removeFromCartSchema };

