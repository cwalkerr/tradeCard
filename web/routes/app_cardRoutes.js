const express = require("express");
const router = express.Router();
const cardController = require("../controllers/app_cardController.js");

router.get("/cards", cardController.cardGrid);
router.get("/cards/:id", cardController.cardDetails);
module.exports = router;
