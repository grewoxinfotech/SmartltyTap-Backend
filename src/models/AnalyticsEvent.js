const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AnalyticsEvent = sequelize.define(
  "AnalyticsEvent",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cardId: { type: DataTypes.STRING, allowNull: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false }, // "tap" or specific link type "click_whatsapp"
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    browser: { type: DataTypes.STRING, allowNull: true },
    os: { type: DataTypes.STRING, allowNull: true },
    device: { type: DataTypes.STRING, allowNull: true },
    ip: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.JSON, allowNull: true }, // { city, country }
  },
  {
    tableName: "analytics_events",
    timestamps: false,
  }
);

module.exports = AnalyticsEvent;
