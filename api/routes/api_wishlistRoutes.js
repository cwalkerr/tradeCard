const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/api_wishlistController.js");

router.get("/wishlist", wishlistController.getWishlist); // what is this for?

router.get("/wishlist/:id", wishlistController.getCardsInWishlist);

router
  .route("/wishlist/:wishlist_id/card/:card_id")
  .post(wishlistController.addCardToWishlist)
  .delete(wishlistController.removeCardFromWishlist);

module.exports = router;
