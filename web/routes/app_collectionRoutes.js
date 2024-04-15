const express = require("express");
const router = express.Router();
const api_collectionController = require("../../api/controllers/api_collectionController.js");
const collectionController = require("../controllers/app_collectionController.js");
const cardController = require("../controllers/app_cardController.js");
const api_cardController = require("../../api/controllers/api_cardController.js");
const verifyLoggedIn = require("../../middleware/middleware.js");

//router.get("/collections", collectionController.collectionsGrid);

router.get(
  "/collections/user",
  verifyLoggedIn("You must be logged in view your collections"),
  collectionController.getUserCollections,
  collectionController.userCollectionsGrid
);
// both create and delete probably dont need to include verification, the user must be logged in to see the page
// keeping it in for now for consistency
router.post(
  "/collections",
  verifyLoggedIn("You must be logged in to create a collection"),
  collectionController.createCollection
);
// BUG TO FIX : cant delete collection if it has cards in it assuming its because of foreign key constraint
// will need to delete the cards first
router.delete(
  "/collections/:id",
  verifyLoggedIn("You must be logged in to delete collections"),
  collectionController.deleteCollection
);

router.get("/collections/:id/cards", cardController.cardGrid);

router.delete(
  "/collections/:collection_id/cards/:card_id",
  verifyLoggedIn("You must be logged in to remove a card from a collection"),
  collectionController.removeCardFromCollection
);

module.exports = router;
