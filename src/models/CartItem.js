const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    product_id: { type: DataTypes.STRING, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = CartItem;

