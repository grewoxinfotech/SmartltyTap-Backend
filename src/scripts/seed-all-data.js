const sequelize = require("../config/db");
const { User, Plan, Product, Template, Settings } = require("../models");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("DB Recreated and Synchronized for seeding.");

    // 1. Seed Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const [admin, adminCreated] = await User.findOrCreate({
      where: { email: "admin@smartlytap.com" },
      defaults: {
        id: "USR-ADMIN-001",
        name: "System Admin",
        email: "admin@smartlytap.com",
        password_hash: adminPassword,
        role: "SUPER_ADMIN",
        plan: "PREMIUM",
        is_active: true,
      },
    });
    if (adminCreated) console.log("Admin user created.");

    // 2. Seed Default Plans
    const plans = [
      { code: "FREE", name: "Free Forever", price: 0, billing_cycle: "MONTHLY", features: { cards: 1, themes: 2 }, is_active: true },
      { code: "BASIC", name: "Basic Plan", price: 499, billing_cycle: "MONTHLY", features: { cards: 3, themes: 5 }, is_active: true },
      { code: "PRO", name: "Pro Professional", price: 1499, billing_cycle: "YEARLY", features: { cards: 20, themes: "unlimited" }, is_active: true },
    ];
    for (const p of plans) {
      await Plan.upsert(p);
    }
    console.log("Plans seeded.");

    // 3. Seed Default Products
    const products = [
      { id: "PROD-BRONZE", name: "Bronze NFC Card", description: "Standard matte finish NFC card", price: 999, category: "CARDS", stock_quantity: 100, is_active: true },
      { id: "PROD-SILVER", name: "Silver Elegance", description: "Premium silver finish card", price: 1499, category: "CARDS", stock_quantity: 50, is_active: true },
      { id: "PROD-GOLD", name: "Luxury Gold", description: "24k Gold plated NFC card", price: 4999, category: "LUXURY", stock_quantity: 10, is_active: true },
    ];
    for (const p of products) {
      await Product.upsert(p);
    }
    console.log("Products seeded.");

    // 4. Seed Default Templates
    const templates = [
      { id: "TPL-MODERN", name: "Modern Minimal", layout_config: { primary: "#4F46E5", font: "Inter" }, is_active: true },
      { id: "TPL-DARK", name: "Dark Executive", layout_config: { primary: "#111827", font: "Roboto" }, is_active: true },
    ];
    for (const t of templates) {
      await Template.upsert(t);
    }
    console.log("Templates seeded.");

    // 5. Seed Global Settings
    await Settings.upsert({
      id: 1,
      branding: {
        company_name: "SmartlyTap",
        logo_url: "https://res.cloudinary.com/demo/image/upload/v1/logo.png",
        default_template_id: "TPL-MODERN"
      },
      feature_flags: {
        allow_signup: true,
        maintenance_mode: false
      }
    });
    console.log("Settings seeded.");

    console.log("All data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
