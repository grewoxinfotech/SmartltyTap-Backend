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
    original_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    image_url: { type: DataTypes.STRING, allowNull: true },
    images: { type: DataTypes.JSON, allowNull: true },
    badge: { type: DataTypes.STRING, allowNull: true }, // For "-50%", "New", "Hot"
    rating: { type: DataTypes.DECIMAL(3, 1), defaultValue: 4.9 },
    reviews_count: { type: DataTypes.INTEGER, defaultValue: 0 },
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

