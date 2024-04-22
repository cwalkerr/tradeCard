const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/api_collectionController.js");
const ratingController = require("../controllers/api_ratingController.js");
const commentController = require("../controllers/api_commentController.js");

/**
 * GET ALL/USER COLLECTIONS
 * gets all collections or accepts query params to get user collections
 */
router.get("/collections", collectionController.getCollections);

/**
 * CREATE COLLECTION, DELETE AND GET COLLECTION BY ID
 */
router.post("/collections/create", collectionController.createCollection);
router
  .route("/collections/:id")
  .get(collectionController.getCollections)
  .delete(collectionController.deleteCollection);

/**
 * GET, ADD AND REMOVE CARDS IN COLLECTION
 */
router.get("/collections/:id/cards", collectionController.getCardsInCollection);
router
  .route("/collections/:collection_id/cards/:card_id")
  .post(collectionController.addCardToCollection)
  .delete(collectionController.removeCardFromCollection);

/*
 * RATING OPERATIONS
 */
router
  .route("/collections/:id/ratings")
  .get(ratingController.getRatingDetails)
  .post(ratingController.addRating)
  .put(ratingController.updateRating);

router
  .route("/collections/:id/ratings/:user_id")
  .get(ratingController.getUserRating)
  .delete(ratingController.deleteRating);

/**
 * COMMENT OPERATIONS
 */

router
  .route("/collections/:id/comments")
  .get(commentController.getAllComments)
  .post(commentController.addComment);

router.delete(
  "/collections/:collection_id/comments/:comment_id",
  commentController.deleteComment
);

module.exports = router;
