const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/app_wishlistController.js");
const cardController = require("../controllers/app_cardController.js");
const verifyLoggedIn = require("../../middleware/middleware.js");

// view cards in wishlist
router.get(
  "/wishlist",
  verifyLoggedIn("You must be logged in to view your wishlist"),
  wishlistController.getUserWishlist,
  cardController.cardGrid
);

// add a card to wishlist
router.post(
  "/wishlist/cards",
  verifyLoggedIn("You must be logged in to add a card to your wishlist"),
  wishlistController.addCardToWishlist
);

// remove a card from wishlist
router.delete(
  "/wishlist/:wishlist_id/cards/:card_id",
  verifyLoggedIn("You must be logged in to remove a card from your wishlist"),
  wishlistController.removeCardFromWishlist
);

module.exports = router;
