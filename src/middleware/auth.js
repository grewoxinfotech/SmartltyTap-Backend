const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ ok: false, message: "Missing token" });
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Unauthenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}

module.exports = { requireAuth, requireRole };

