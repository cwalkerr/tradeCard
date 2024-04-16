const express = require("express");
const router = express.Router();
const cardController = require("../controllers/app_cardController.js");
const collectionController = require("../controllers/app_collectionController.js");
const wishlistController = require("../controllers/app_wishlistController.js");
const verifyLoggedIn = require("../../middleware/middleware.js");

router.get("/cards", cardController.cardGrid);
router.get(
  "/cards/:id",
  collectionController.getUserCollections,
  wishlistController.getUserWishlist,
  cardController.cardDetails
);

module.exports = router;
