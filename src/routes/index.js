const { Router } = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/users.routes");
const cardRoutes = require("../modules/cards/cards.routes");
const linkRoutes = require("../modules/links/links.routes");
const productsRoutes = require("../modules/products/products.routes");
const cartRoutes = require("../modules/cart/cart.routes");
const orderRoutes = require("../modules/orders/orders.routes");
const paymentRoutes = require("../modules/payments/payments.routes");
const adminRoutes = require("../modules/admin/admin.routes");
const resellerRoutes = require("../modules/resellers/resellers.routes");
const analyticsRoutes = require("../modules/analytics/analytics.routes");
const profilesRoutes = require("../modules/profiles/profiles.routes");
const redirectRoutes = require("./redirect");
const settingsRoutes = require("../modules/settings/settings.routes");
const templatesRoutes = require("../modules/templates/templates.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cards", cardRoutes);
router.use("/links", linkRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/admin", adminRoutes);
router.use("/reseller", resellerRoutes);
router.use("/profile", profilesRoutes);
router.use("/", redirectRoutes);
router.use("/settings", settingsRoutes);
router.use("/templates", templatesRoutes);

module.exports = router;

