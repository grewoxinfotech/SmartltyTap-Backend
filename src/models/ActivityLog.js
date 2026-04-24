const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    actor_user_id: { type: DataTypes.STRING, allowNull: true },
    actor_role: { type: DataTypes.STRING, allowNull: true },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity: { type: DataTypes.STRING(100), allowNull: true },
    entity_id: { type: DataTypes.STRING(255), allowNull: true },
    ip: { type: DataTypes.STRING(50), allowNull: true },
    user_agent: { type: DataTypes.STRING(512), allowNull: true },
    meta: { type: DataTypes.JSON, allowNull: true },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["actor_user_id"] }, { fields: ["action"] }, { fields: ["created_at"] }],
  }
);

module.exports = ActivityLog;

