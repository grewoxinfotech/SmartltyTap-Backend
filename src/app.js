const express = require("express");
const cors = require("cors");
const { env } = require("./config/env");
const apiV1 = require("./routes");
const sequelize = require("./config/db");
require("./models");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_, res) => res.json({ ok: true, service: "smartlytap-backend" }));
app.use("/api/v1", apiV1);

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("DB connect failed:", err?.message || err);
    process.exit(1);
  }
})();

