const { z } = require("zod");

const createCardSchema = z.object({
  userId: z.string().min(1).optional().nullable(),
  cardUid: z.string().optional(),
});

const updateCardStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = { createCardSchema, updateCardStatusSchema };

