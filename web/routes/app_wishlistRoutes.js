const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/app_wishlistController.js");
const cardController = require("../controllers/app_cardController.js");
const filterController = require("../controllers/app_filterController.js");
const {
  verifyLoggedIn,
  catchError,
} = require("../../middleware/middleware.js");

// view cards in wishlist
router
  .route("/wishlist")
  .all(verifyLoggedIn("You must be logged in to view your wishlist"))
  .get(
    wishlistController.getUserWishlist,
    wishlistController.getCardsInWishlist,
    filterController.getFilterOptions,
    cardController.cardGrid,
    catchError("/dashboard")
  );

// add or remove cards from wishlist dont think this error handling works as i want anywhere
router
  .route("/wishlist/:wishlist_id/card/:card_id")
  .all(verifyLoggedIn("You must be logged in to manage your wishlist"))
  .post(wishlistController.addCardToWishlist, catchError("back"))
  .delete(wishlistController.removeCardFromWishlist, catchError("back"));

module.exports = router;
