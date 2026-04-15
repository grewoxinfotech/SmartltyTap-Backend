import "dotenv/config";

export const env = {
  port: Number(process.env.API_PORT || 5000),
  dbName: process.env.DB_NAME || "",
  dbUser: process.env.DB_USER || "",
  dbPassword: process.env.DB_PASSWORD || "",
  dbHost: process.env.DB_HOST || "localhost",
  timezone: process.env.TIMEZONE || "+00:00",
};

