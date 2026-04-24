const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdminPermission = sequelize.define(
  "AdminPermission",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    is_super: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    permissions: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "admin_permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = AdminPermission;

