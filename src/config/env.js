require("dotenv").config();

const env = {
  port: Number(process.env.PORT || 5000),
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "",
  },
  timezone: process.env.TIMEZONE || "+05:30",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    secret: process.env.RAZORPAY_SECRET || "",
  },
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
};

module.exports = { env };

