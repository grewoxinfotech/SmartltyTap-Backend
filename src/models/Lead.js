const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Lead = sequelize.define(
  "Lead",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    card_uid: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    source: { type: DataTypes.STRING, allowNull: true, defaultValue: "web" },
  },
  {
    tableName: "leads",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["created_at"] },
      { fields: ["card_uid"] },
    ],
  }
);

module.exports = Lead;
