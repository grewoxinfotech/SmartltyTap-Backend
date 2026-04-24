const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AdminPermission } = require("../models");

function normalizeRole(role) {
  if (role === "SUPER_ADMIN") return "ADMIN";
  if (role === "CARD_OWNER") return "USER";
  return role;
}

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
  const allowed = roles.map(normalizeRole);
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Unauthenticated" });
    const currentRole = normalizeRole(req.user.role);
    if (!allowed.includes(currentRole)) return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}

function requirePermission(permissionKey) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Unauthenticated" });
    const currentRole = normalizeRole(req.user.role);
    if (currentRole !== "ADMIN") return res.status(403).json({ ok: false, message: "Forbidden" });

    const perm = await AdminPermission.findOne({ where: { user_id: req.user.id, is_active: true } });
    // Back-compat: existing admins without a permissions row are treated as super-admin.
    if (!perm) return next();
    if (perm.is_super) return next();

    const allowed = perm.permissions?.[permissionKey] === true;
    if (!allowed) return res.status(403).json({ ok: false, message: "Forbidden" });
    return next();
  };
}

module.exports = { requireAuth, requireRole, requirePermission };

