const { Router } = require("express");
const controller = require("./auth.controller");

const router = Router();

router.post("/register", controller.signup);
router.post("/signup", controller.signup);
router.post("/login", controller.login);

module.exports = router;

