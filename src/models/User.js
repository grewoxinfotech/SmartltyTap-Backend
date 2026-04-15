const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middlewares/generatorId");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: () => generateId("USR"),
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "USER", "RESELLER"), allowNull: false, defaultValue: "USER" },
    plan: { type: DataTypes.ENUM("BASIC", "PREMIUM"), allowNull: false, defaultValue: "BASIC" },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

User.beforeCreate(async (user) => {
  let isUnique = false;
  let newId;
  while (!isUnique) {
    newId = generateId("USR");
    // eslint-disable-next-line no-await-in-loop
    const existing = await User.findOne({ where: { id: newId } });
    if (!existing) isUnique = true;
  }
  user.id = newId;
});

module.exports = User;

