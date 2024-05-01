const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/api_collectionController.js");
const ratingController = require("../controllers/api_ratingController.js");
const commentController = require("../controllers/api_commentController.js");
const {
  authenticateToken,
  verifyUserId,
} = require("../../middleware/authMiddleware.js");

/**
 * GET ALL/USER COLLECTIONS
 * gets all collections or accepts query params to get user collections
 */
router.get("/collections", collectionController.getCollections);

/**
 * CREATE COLLECTION, DELETE AND GET COLLECTION BY ID
 */
router.post(
  "/collections/create",
  authenticateToken,
  collectionController.createCollection
);
router
  .route("/collections/:id")
  .get(collectionController.getCollections)
  .delete(authenticateToken, collectionController.deleteCollection);

/**
 * GET, ADD AND REMOVE CARDS IN COLLECTION
 */
router.get("/collections/:id/cards", collectionController.getCardsInCollection);
router
  // .all(authenticateToken)
  .route("/collections/:collection_id/cards/:card_id")
  .post(authenticateToken, collectionController.addCardToCollection)
  .delete(authenticateToken, collectionController.removeCardFromCollection);

/*
 * RATING OPERATIONS
 */
router
  .route("/collections/:id/ratings")
  .get(ratingController.getRatingDetails)
  .post(authenticateToken, ratingController.addRating)
  .put(authenticateToken, ratingController.updateRating);

router
  .route("/collections/:id/ratings/:userId")
  // .all(authenticateToken, verifyUserId)
  .get(authenticateToken, verifyUserId, ratingController.getUserRating)
  .delete(authenticateToken, verifyUserId, ratingController.deleteRating);

/**
 * COMMENT OPERATIONS
 */

router
  .route("/collections/:id/comments")
  .get(commentController.getAllComments)
  .post(authenticateToken, commentController.addComment);

router.delete(
  "/collections/:collection_id/comments/:comment_id",
  authenticateToken,
  commentController.deleteComment
);

module.exports = router;
