const { z } = require("zod");

const updatePlanSchema = z.object({ plan: z.enum(["BASIC", "PREMIUM"]) });
const updateStatusSchema = z.object({ isActive: z.boolean() });

module.exports = { updatePlanSchema, updateStatusSchema };

