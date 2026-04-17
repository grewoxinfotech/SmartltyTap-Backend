const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { env } = require("./config/env");
const apiV1 = require("./routes");
const sequelize = require("./config/db");
require("./models");

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS — allow website + admin origins
const allowedOrigins = [
  env.appBaseUrl,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// Global rate limiting — 200 req/15min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Stricter rate limiting for auth routes — 20 req/15min
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many auth attempts, please try again later." },
});
app.use("/api/v1/auth", authLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));

// ── Static uploads (local fallback) ──────────────────────────────────────────
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ ok: true, service: "smartlytap-backend" }));
app.get("/", (req, res) => {
  res.status(200).json({ ok: true, message: "Welcome to SmartlyTap Backend API", version: "1.0.0" });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", apiV1);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Not Found",
    message: `The requested endpoint '${req.method} ${req.originalUrl}' does not exist.`,
  });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred.",
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    await sequelize.authenticate();
    try {
      await sequelize.sync({ alter: true }); // prefer schema alignment in dev
    } catch (syncErr) {
      console.warn("Sequelize alter sync failed, falling back to sync():", syncErr?.message || syncErr);
      await sequelize.sync();
    }
    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("DB connect failed:", err?.message || err);
    process.exit(1);
  }
})();
