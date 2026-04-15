const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const generateId = require("../middlewares/generatorId");

const Card = sequelize.define(
  "Card",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      defaultValue: () => generateId("CRD"),
    },
    card_uid: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_id: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    tap_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    redirect_mode: { type: DataTypes.ENUM("DIRECT", "SMART"), allowNull: false, defaultValue: "SMART" },
    direct_google_url: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  {
    tableName: "cards",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

Card.beforeCreate(async (card) => {
  // Ensure unique card_uid
  let uidOk = false;
  while (!uidOk) {
    const uid = `NFC-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
    // eslint-disable-next-line no-await-in-loop
    const existing = await Card.findOne({ where: { card_uid: uid } });
    if (!existing) {
      card.card_uid = uid;
      uidOk = true;
    }
  }

  // Ensure unique id
  let idOk = false;
  while (!idOk) {
    const newId = generateId("CRD");
    // eslint-disable-next-line no-await-in-loop
    const existing = await Card.findOne({ where: { id: newId } });
    if (!existing) {
      card.id = newId;
      idOk = true;
    }
  }
});

module.exports = Card;

