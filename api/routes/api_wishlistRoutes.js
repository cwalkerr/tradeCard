const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/api_wishlistController.js");
const cardController = require("../controllers/api_cardController.js");

router.get("/wishlist", wishlistController.getWishlist);
router.get(
  "/wishlist/:wishlist_id/cards",
  wishlistController.getCardsInWishlist,
  cardController.getCardTiles // feel like this shouldnt be an api function - its handling view stuff
);
router.post(
  "/wishlist/:wishlist_id/cards",
  wishlistController.addCardToWishlist
);
router.delete(
  "/wishlist/:wishlist_id/cards/:card_id",
  wishlistController.removeCardFromWishlist
);

module.exports = router;
