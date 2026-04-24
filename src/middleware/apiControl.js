const { Settings } = require("../models");

let cache = { at: 0, data: null };
const TTL_MS = 60 * 1000;

async function getApiControl() {
  const now = Date.now();
  if (cache.data && now - cache.at < TTL_MS) return cache.data;
  const settings = await Settings.findOne();
  const apiControl = settings?.branding?.api_control || {};
  cache = { at: now, data: apiControl };
  return apiControl;
}

function apiControlMiddleware() {
  return async (req, res, next) => {
    const apiControl = await getApiControl();
    if (apiControl?.maintenance_mode) {
      // Allow health check and admin auth to still function.
      const allow = req.path === "/health" || req.path.startsWith("/api/v1/auth/login");
      if (!allow) {
        return res.status(503).json({ ok: false, message: "Maintenance mode" });
      }
    }
    return next();
  };
}

async function isSignupDisabled() {
  const apiControl = await getApiControl();
  return apiControl?.disable_signup === true;
}

module.exports = { apiControlMiddleware, isSignupDisabled };

