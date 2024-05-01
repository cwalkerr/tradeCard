const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/api_wishlistController.js");
const { authenticateToken } = require("../../middleware/authMiddleware.js");

router.get("/wishlist", authenticateToken, wishlistController.getWishlist);

router.get(
  "/wishlist/:wishlist_id",
  authenticateToken,
  wishlistController.verifyWishlistOwner,
  wishlistController.getCardsInWishlist
);

router
  .route("/wishlist/:wishlist_id/card/:card_id")
  .all(authenticateToken, wishlistController.verifyWishlistOwner)
  .post(wishlistController.addCardToWishlist)
  .delete(wishlistController.removeCardFromWishlist);

module.exports = router;
