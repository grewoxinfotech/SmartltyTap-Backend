const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middleware/generatorId");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => generateId("ORD") },
    user_id: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM("PENDING", "PAID", "PROCESSING", "DELIVERED"), allowNull: false, defaultValue: "PENDING" },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: "INR" },
    invoice_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;

