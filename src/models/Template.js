const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middleware/generatorId");

const Template = sequelize.define(
  "Template",
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => generateId("TPL") },
    name: { type: DataTypes.STRING, allowNull: false },
    layout_config: { type: DataTypes.JSON, allowNull: true },
    preview_image: { type: DataTypes.STRING, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "templates",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Template;
