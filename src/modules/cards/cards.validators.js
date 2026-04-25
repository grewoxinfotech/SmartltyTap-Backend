const { z } = require("zod");

const createCardSchema = z.object({
  userId: z.string().min(1).optional().nullable(),
  cardUid: z.string().optional(),
});

const sellCardSchema = z.object({
  cardUid: z.string().min(1),
  buyerName: z.string().min(2),
  buyerEmail: z.string().email(),
  buyerPhone: z.string().min(6).optional().nullable(),
  businessType: z.string().min(2).optional().nullable(),
  templateId: z.string().min(1).optional().nullable(),
});

const updateCardStatusSchema = z.object({
  isActive: z.boolean(),
});

module.exports = { createCardSchema, sellCardSchema, updateCardStatusSchema };

