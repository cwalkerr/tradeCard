const express = require("express");
const router = express.Router();
const cardController = require("../controllers/app_cardController.js");
const collectionController = require("../controllers/app_collectionController.js");
const verifyLoggedIn = require("../../middleware/middleware.js");

router.get("/cards", cardController.cardGrid);
router.get(
  "/cards/:id",
  collectionController.getUserCollections,
  cardController.cardDetails
);

router.post(
  "/collections/cards/",
  verifyLoggedIn("You must be logged in to add a card to a collection"),
  collectionController.addCardToCollection
);
module.exports = router;
