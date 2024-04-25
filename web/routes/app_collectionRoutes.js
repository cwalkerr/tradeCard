const express = require("express");
const router = express.Router();
const collectionController = require("../controllers/app_collectionController.js");
const cardController = require("../controllers/app_cardController.js");
const ratingController = require("../controllers/app_ratingController.js");
const commentController = require("../controllers/app_commentController.js");
const filterController = require("../controllers/app_filterController.js");
const {
  verifyLoggedIn,
  catchError,
} = require("../../middleware/middleware.js");

/**
 * GET ALL COLLECTIONS
 */
router.get(
  "/collections",
  collectionController.getCollections,
  collectionController.renderCollections,
  catchError("/")
);

/**
 * GET AND CREATE USER COLLECTIONS
 */
router
  .route("/collections/user")
  .all(verifyLoggedIn("You must be logged in view or create collections"))
  .get(
    collectionController.getCollections,
    collectionController.renderCollections,
    catchError("/")
  )
  .post(collectionController.createCollection, catchError("/collections/user"));

/**
 * DELETE COLLECTION
 */
router.delete(
  "/collections/:id",
  verifyLoggedIn("You must be logged in to delete collections"),
  collectionController.deleteCollection,
  catchError("/collections/user")
);

/**
 * GETS ALL INFO FOR A COLLECTION AND RENDERS IT
 *
 */
router.get(
  "/collections/:collection_id/cards",
  collectionController.getCollections,
  collectionController.getCardsInCollection,
  ratingController.getCollectionRatings,
  commentController.getCollectionComments,
  filterController.getFilterOptions,
  cardController.cardGrid,
  catchError("/")
);

/**
 * ADDS A CARD TO A COLLECTION
 */
router.post(
  "/collections/cards/:card_id",
  verifyLoggedIn("You must be logged in to add a card to a collection"),
  collectionController.addCardToCollection,
  catchError(`back`)
);

/**
 * REMOVE A CARD FROM A COLLECTION
 */
router.delete(
  "/collections/:collection_id/cards/:card_id",
  verifyLoggedIn("You must be logged in to remove a card from a collection"),
  collectionController.removeCardFromCollection,
  catchError(`back`)
);

/**
 * REMOVE A RATING FROM A COLLECTION
 * should probably use rating_id instead of user_id
 * adding and updating a rating is done in front end js script
 */
router.delete(
  "/collections/:collection_id/ratings/:user_id",
  verifyLoggedIn("You must be logged in to remove a rating"),
  ratingController.removeRatingFromCollection,
  catchError(`back`)
);

// maybe add a new route file for these, but they are assosiated to collections
/**
 * ADDS A COMMENT TO A COLLECTION
 */
router.post(
  "/collections/:collection_id/comments",
  verifyLoggedIn("You must be logged in to comment on a collection"),
  commentController.addCommentToCollection,
  catchError(`/collections/:collection_id/cards`)
);

/**
 * DELETES A COMMENT FROM A COLLECTION
 */
router.delete(
  "/collections/:collection_id/comments/:comment_id",
  verifyLoggedIn("You must be logged in to delete a comment"),
  commentController.deleteCommentFromCollection,
  catchError(`back`)
);

module.exports = router;
