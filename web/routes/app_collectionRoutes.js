const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/app_collectionController.js");
const cardController = require("../controllers/app_cardController.js");
const verifyLoggedIn = require("../../middleware/middleware.js");

// gets all collections
router.get("/collections", collectionController.collectionsGrid);

// gets all collections for the logged in user
router.get(
  "/collections/user",
  verifyLoggedIn("You must be logged in view your collections"),
  collectionController.getUserCollections,
  collectionController.collectionsGrid
);
// both create and delete probably dont need to include verification, the user must be logged in to see the page
// keeping it in for now for consistency
router.post(
  "/collections",
  verifyLoggedIn("You must be logged in to create a collection"),
  collectionController.createCollection
);

router.delete(
  "/collections/:id",
  verifyLoggedIn("You must be logged in to delete collections"),
  collectionController.deleteCollection
);

// displays the cards in a collection
router.get("/collections/:collection_id/cards", cardController.cardGrid);

// adds a card to a collection
router.post(
  "/collections/cards/",
  verifyLoggedIn("You must be logged in to add a card to a collection"),
  collectionController.addCardToCollection
);

// removes a card from a collection
router.delete(
  "/collections/:collection_id/cards/:card_id",
  verifyLoggedIn("You must be logged in to remove a card from a collection"),
  collectionController.removeCardFromCollection
);

router.delete(
  "/collections/:collection_id/ratings/:user_id",
  verifyLoggedIn("You must be logged in to remove a rating"),
  collectionController.removeRatingFromCollection
);

module.exports = router;
