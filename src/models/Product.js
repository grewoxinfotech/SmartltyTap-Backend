const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middlewares/generatorId");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.STRING, primaryKey: true, unique: true, defaultValue: () => generateId("PRD") },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Product;

