const express = require("express");
const router = express.Router();
const cardController = require("../controllers/api_cardController.js");

router.get("/cards", cardController.getCards);
router.get("/cards/grid", cardController.getCardGrid);
router.get("/cards/:id", cardController.getCardById);

module.exports = router;
