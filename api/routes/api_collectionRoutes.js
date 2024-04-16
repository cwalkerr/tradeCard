const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/api_collectionController.js");
const cardController = require("../controllers/api_cardController.js");

router.get("/collections", collectionController.getCollections);
router.post("/collections/create", collectionController.createCollection);
router.delete("/collections/:id", collectionController.deleteCollection);

// this apparently doesnt work - web app is fine?? - im guessing its because theres a problem with the next function
router.get(
  "/collections/:collection_id/cards",
  collectionController.getCardsInCollection,
  cardController.getCardTiles
);
router.post("/collections/:id/cards", collectionController.addCardToCollection);
router.delete(
  "/collections/:collection_id/cards/:card_id",
  collectionController.removeCardFromCollection
);

module.exports = router;
