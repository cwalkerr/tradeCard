const express = require("express");
const router = express.Router();
const cardController = require("../controllers/app_cardController.js");
const collectionController = require("../controllers/app_collectionController.js");
const wishlistController = require("../controllers/app_wishlistController.js");
const filterController = require("../controllers/app_filterController.js");
const { catchError } = require("../../middleware/middleware.js");

router.get(
  "/cards",
  filterController.getFilterOptions,
  cardController.cardGrid,
  catchError("/cards")
);

router.get(
  "/cards/:id",
  collectionController.getCollections,
  wishlistController.getUserWishlist,
  cardController.cardDetails,
  catchError("back")
);

module.exports = router;
