const sequelize = require("./config/db");
require("./models");

const { env } = require("./config/env");
const { createApp } = require("./app");
const { startCronJobs } = require("./config/cron");

(async () => {
  try {
    await sequelize.authenticate();
    try {
      await sequelize.sync({ alter: true });
    } catch (syncErr) {
      const msg = syncErr?.message || String(syncErr);
      if (msg.includes("Too many keys specified") || msg.includes("max 64 keys allowed")) {
        console.warn("Sequelize alter sync skipped (MySQL key limit):", msg);
      } else {
        throw syncErr;
      }
    }

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
    startCronJobs();
  } catch (err) {
    console.error("DB connect failed:", err?.message || err);
    process.exit(1);
  }
})();

