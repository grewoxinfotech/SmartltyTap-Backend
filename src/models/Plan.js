const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define(
  "Plan",
  {
    code: { type: DataTypes.STRING(30), primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    billing_cycle: { type: DataTypes.ENUM("MONTHLY", "YEARLY"), allowNull: false, defaultValue: "MONTHLY" },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    features: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "plans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Plan;

