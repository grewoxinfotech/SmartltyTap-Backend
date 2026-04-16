const User = require("./User");
const Card = require("./Card");
const AnalyticsEvent = require("./AnalyticsEvent");
const Profile = require("./Profile");
const Link = require("./Link");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");
const CartItem = require("./CartItem");
const Template = require("./Template");
const Reseller = require("./Reseller");
const Settings = require("./Settings");

User.hasMany(Card, { foreignKey: "user_id" });
Card.belongsTo(User, { foreignKey: "user_id" });

User.hasOne(Profile, { foreignKey: "user_id" });
Profile.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Link, { foreignKey: "user_id" });
Link.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

Order.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

User.hasMany(CartItem, { foreignKey: "user_id" });
CartItem.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

User.hasOne(Reseller, { foreignKey: "user_id" });
Reseller.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Card,
  Profile,
  Link,
  Product,
  Order,
  OrderItem,
  Payment,
  CartItem,
  Template,
  Reseller,
  AnalyticsEvent,
  Settings,
};

