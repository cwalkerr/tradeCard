const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/api_collectionController.js");
const cardController = require("../controllers/api_cardController.js");
const ratingController = require("../controllers/api_ratingController.js");
const commentController = require("../controllers/api_commentController.js");

/**
 * GET CREATE AND DELETE COLLECTIONS
 */
router.get("/collections", collectionController.getCollections);
router.post("/collections/create", collectionController.createCollection);
router.delete("/collections/:id", collectionController.deleteCollection);

/**
 * GET ADD AND REMOVE CARDS FROM COLLECTION
 */
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

/*
 * RATING OPERATIONS
 */
router.get("/collections/:id/ratings", ratingController.getRatingDetails);
router.get("/collections/:id/ratings/:user_id", ratingController.getUserRating);
router.post("/collections/:id/ratings", ratingController.addRating);
router.put("/collections/:id/ratings", ratingController.updateRating);
router.delete(
  "/collections/:id/ratings/:user_id", // revise this endpoint
  ratingController.deleteRating
);

/**
 * COMMENT OPERATIONS
 */

router.get("/collections/:id/comments", commentController.getAllComments);
router.post("/collections/:id/comments", commentController.addComment);
router.delete(
  "/collections/:collection_id/comments/:comment_id",
  commentController.deleteComment
);

module.exports = router;
