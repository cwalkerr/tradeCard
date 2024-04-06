const express = require("express");
const router = express.Router();
const cardController = require("../controllers/api_cardController.js");

// define routes for api endpoints for card operations
router.get("/cards", cardController.getCardTiles);
router.get("/cards/:id", cardController.getCardById);

module.exports = router;
