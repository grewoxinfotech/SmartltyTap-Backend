const { z } = require("zod");

const createOrderSchema = z.object({
  userId: z.string().min(1),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().min(1).max(100),
    })
  ).min(1),
});

module.exports = { createOrderSchema };

