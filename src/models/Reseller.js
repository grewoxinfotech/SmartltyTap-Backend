const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reseller = sequelize.define(
  "Reseller",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    pricing_discount_pct: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 10.0 },
    commission_pct: { type: DataTypes.DECIMAL(5, 2), allowNull: false, defaultValue: 10.0 },
    total_sales: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    commission_earned: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "resellers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Reseller;

