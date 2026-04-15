const { Router } = require("express");
const cardsController = require("../modules/cards/cards.controller");

const router = Router();

// Critical NFC redirect endpoint
router.get("/r/:cardId", cardsController.redirect);

module.exports = router;

