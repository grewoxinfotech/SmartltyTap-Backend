const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AnalyticsTap = sequelize.define(
  "AnalyticsTap",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    card_uid: { type: DataTypes.STRING, allowNull: false },
    tapped_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "analytics_taps",
    timestamps: false,
  }
);

module.exports = AnalyticsTap;

