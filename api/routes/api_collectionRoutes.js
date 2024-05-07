const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/api_collectionController.js");
const ratingController = require("../controllers/api_ratingController.js");
const commentController = require("../controllers/api_commentController.js");
const {
  authenticateToken,
  verifyUserId,
} = require("../../middleware/authMiddleware.js");
const errorHandler = require("../../middleware/errorHandler.js");

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
  collectionController.createCollection,
  errorHandler
);
router
  .route("/collections/:id")
  .get(collectionController.getCollections)
  .delete(
    authenticateToken,
    collectionController.deleteCollection,
    errorHandler
  );

/**
 * GET, ADD AND REMOVE CARDS IN COLLECTION
 */
router.get("/collections/:id/cards", collectionController.getCardsInCollection);
router
  .route("/collections/:collection_id/cards/:card_id")
  .post(
    authenticateToken,
    collectionController.addCardToCollection,
    errorHandler
  )
  .delete(
    authenticateToken,
    collectionController.removeCardFromCollection,
    errorHandler
  );

/*
 * RATING OPERATIONS
 */
router
  .route("/collections/:id/ratings")
  .get(ratingController.getRatingDetails)
  .post(authenticateToken, ratingController.addRating, errorHandler)
  .put(authenticateToken, ratingController.updateRating, errorHandler);

router
  .route("/collections/:id/ratings/:userId")
  .get(authenticateToken, verifyUserId, ratingController.getUserRating)
  .delete(
    authenticateToken,
    verifyUserId,
    ratingController.deleteRating,
    errorHandler
  );

/**
 * COMMENT OPERATIONS
 */

router
  .route("/collections/:id/comments")
  .get(commentController.getAllComments)
  .post(authenticateToken, commentController.addComment, errorHandler);

router.delete(
  "/collections/:collection_id/comments/:comment_id",
  authenticateToken,
  commentController.deleteComment,
  errorHandler
);

module.exports = router;
