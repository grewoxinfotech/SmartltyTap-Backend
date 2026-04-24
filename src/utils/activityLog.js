const { ActivityLog } = require("../models");

async function logActivity(req, { action, entity, entityId, meta }) {
  try {
    await ActivityLog.create({
      actor_user_id: req.user?.id || null,
      actor_role: req.user?.role || null,
      action,
      entity: entity || null,
      entity_id: entityId || null,
      ip: req.headers["x-forwarded-for"]?.toString()?.split(",")?.[0]?.trim() || req.socket?.remoteAddress || null,
      user_agent: req.headers["user-agent"] || null,
      meta: meta || null,
    });
  } catch (e) {
    // Don't break API on logging failures.
    // eslint-disable-next-line no-console
    console.error("Activity log failed:", e?.message || e);
  }
}

module.exports = { logActivity };

