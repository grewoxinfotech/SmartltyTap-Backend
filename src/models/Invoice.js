const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    plan_code: { type: DataTypes.STRING(30), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    currency: { type: DataTypes.STRING(10), allowNull: false, defaultValue: "INR" },
    status: { type: DataTypes.ENUM("DUE", "PAID", "VOID"), allowNull: false, defaultValue: "DUE" },
    due_date: { type: DataTypes.DATE, allowNull: true },
    paid_at: { type: DataTypes.DATE, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "invoices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Invoice;

