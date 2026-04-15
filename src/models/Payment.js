const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middlewares/generatorId");

const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, defaultValue: () => generateId("PAY") },
    order_id: { type: DataTypes.STRING, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false, defaultValue: "RAZORPAY" },
    razorpay_order_id: { type: DataTypes.STRING, allowNull: true },
    razorpay_payment_id: { type: DataTypes.STRING, allowNull: true },
    razorpay_signature: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.ENUM("CREATED", "CAPTURED", "FAILED", "REFUNDED"), allowNull: false, defaultValue: "CREATED" },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    currency: { type: DataTypes.STRING, allowNull: false, defaultValue: "INR" },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Payment;

