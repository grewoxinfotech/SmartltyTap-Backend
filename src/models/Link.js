const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Link = sequelize.define(
  "Link",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("google_review", "whatsapp", "instagram", "website", "phone", "email"), allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "links",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = Link;
