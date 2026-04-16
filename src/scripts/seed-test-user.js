const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
require("../models");
const { User } = require("../models");
const { env } = require("../config/env");

async function main() {
  const email = process.env.TEST_USER_EMAIL || "test.user@smartlytap.com";
  const password = process.env.TEST_USER_PASSWORD || "Test@1234";
  const name = process.env.TEST_USER_NAME || "Test User";

  await sequelize.authenticate();
  await sequelize.sync();

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log("Test user already exists:");
    // eslint-disable-next-line no-console
    console.log({ id: existing.id, email: existing.email, role: existing.role, plan: existing.plan });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({
    name,
    email,
    password_hash: passwordHash,
    role: "USER",
    plan: "BASIC",
    is_active: true,
  });

  // eslint-disable-next-line no-console
  console.log("Created test user:");
  // eslint-disable-next-line no-console
  console.log({ id: created.id, email: created.email, password, role: created.role, plan: created.plan });
  // eslint-disable-next-line no-console
  console.log(`Login endpoint: http://localhost:${env.port}/api/v1/auth/login`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err?.message || err);
    process.exit(1);
  });

