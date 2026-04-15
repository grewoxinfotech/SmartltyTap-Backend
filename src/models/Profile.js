const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middlewares/generatorId");

const Profile = sequelize.define(
  "Profile",
  {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, defaultValue: () => generateId("PROF") },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    template: { type: DataTypes.STRING, allowNull: true, defaultValue: "template-01" },
    mode: { type: DataTypes.ENUM("DIRECT", "SMART"), allowNull: false, defaultValue: "SMART" },
    logo_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    brand_primary: { type: DataTypes.STRING, allowNull: true, defaultValue: "#4F46E5" },
    brand_secondary: { type: DataTypes.STRING, allowNull: true, defaultValue: "#0ea5e9" },
  },
  {
    tableName: "profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Profile;

