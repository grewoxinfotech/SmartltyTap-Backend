const { Router } = require("express");
const controller = require("./auth.controller");
const { requireAuth } = require("../../middleware/auth");

const router = Router();

router.post("/register", controller.signup);
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.post("/change-password", requireAuth, controller.changePassword);
router.post("/update-email", requireAuth, controller.updateEmail);

// OTP Auth
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);


module.exports = router;
