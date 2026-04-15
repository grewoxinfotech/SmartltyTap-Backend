const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AnalyticsClick = sequelize.define(
  "AnalyticsClick",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("google_review", "whatsapp", "instagram", "website", "phone", "email"), allowNull: false },
    clicked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "analytics_clicks",
    timestamps: false,
  }
);

module.exports = AnalyticsClick;

