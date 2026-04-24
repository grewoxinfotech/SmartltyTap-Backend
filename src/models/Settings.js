const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middleware/generatorId");

const Settings = sequelize.define(
  "Settings",
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => generateId("SET") },
    site_name: { type: DataTypes.STRING, allowNull: true },
    logo_url: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    razorpay_key: { type: DataTypes.STRING, allowNull: true },
    razorpay_secret: { type: DataTypes.STRING, allowNull: true },
    smtp_config: { type: DataTypes.JSON, allowNull: true },
    whatsapp_number: { type: DataTypes.STRING, allowNull: true },
    branding: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "settings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Settings;
