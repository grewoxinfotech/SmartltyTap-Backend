const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  },
  {
    tableName: "order_items",
    timestamps: false,
  }
);

module.exports = OrderItem;

