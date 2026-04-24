const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    plan_code: { type: DataTypes.STRING(30), allowNull: false },
    status: { type: DataTypes.ENUM("ACTIVE", "PAST_DUE", "CANCELLED"), allowNull: false, defaultValue: "ACTIVE" },
    billing_mode: { type: DataTypes.ENUM("MANUAL", "AUTO"), allowNull: false, defaultValue: "MANUAL" },
    started_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    next_billing_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "user_subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = UserSubscription;

