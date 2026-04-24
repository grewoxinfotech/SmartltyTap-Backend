const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middleware/generatorId");

const Profile = sequelize.define(
  "Profile",
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => generateId("PROF") },
    user_id: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: true },
    business_name: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    profile_image: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    whatsapp: { type: DataTypes.STRING, allowNull: true },
    instagram: { type: DataTypes.STRING, allowNull: true },
    website: { type: DataTypes.STRING, allowNull: true },
    google_review: { type: DataTypes.STRING, allowNull: true },
    template: { type: DataTypes.STRING, allowNull: true, defaultValue: "template-01" },
    mode: { type: DataTypes.ENUM("DIRECT", "SMART"), allowNull: false, defaultValue: "SMART" },
    logo_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    brand_primary: { type: DataTypes.STRING, allowNull: true, defaultValue: "#4F46E5" },
    brand_secondary: { type: DataTypes.STRING, allowNull: true, defaultValue: "#0ea5e9" },
    gallery: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    portfolio: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    testimonials: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    brochure_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    brochure_name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  {
    tableName: "profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{ name: "profiles_user_id_unique", unique: true, fields: ["user_id"] }],
  }
);

module.exports = Profile;
