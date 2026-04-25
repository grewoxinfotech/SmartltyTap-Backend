const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

function parseEnvUsersFromFlatVars(sourceEnv) {
  const indices = new Set();
  const keyPattern = /^ENV_USER_(\d+)_EMAIL$/;

  for (const key of Object.keys(sourceEnv)) {
    const match = key.match(keyPattern);
    if (match) indices.add(match[1]);
  }

  return Array.from(indices)
    .sort((a, b) => Number(a) - Number(b))
    .map((index) => {
      const email = sourceEnv[`ENV_USER_${index}_EMAIL`];
      const password = sourceEnv[`ENV_USER_${index}_PASSWORD`];
      if (!email || !password) return null;

      return {
        id: sourceEnv[`ENV_USER_${index}_ID`] || `ENV-${index}`,
        name: sourceEnv[`ENV_USER_${index}_NAME`] || `Env User ${index}`,
        email,
        password,
        role: sourceEnv[`ENV_USER_${index}_ROLE`] || "ADMIN",
        plan: sourceEnv[`ENV_USER_${index}_PLAN`] || "BASIC",
      };
    })
    .filter(Boolean);
}

const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "",
  },
  timezone: process.env.TIMEZONE || "+05:30",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    secret: process.env.RAZORPAY_SECRET || "",
  },
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  smtp: {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || "noreply@smartlytap.com",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  envUsers: parseEnvUsersFromFlatVars(process.env),
};

module.exports = { env };
