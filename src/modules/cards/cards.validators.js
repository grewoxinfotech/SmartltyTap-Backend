const { z } = require("zod");

const createCardSchema = z.object({
  userId: z.string().min(1),
});

const updateCardStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = { createCardSchema, updateCardStatusSchema };

