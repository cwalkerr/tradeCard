const axios = require("axios");

const API_URL_COLLECTIONS = "http://localhost:4000/api/collections";
const SUCCESS_STATUS_CODE = 200;

exports.getCollectionRatings = async (req, res, next) => {
  const collection_id = req.params.collection_id;

  try {
    const collectionRatings = await axios.get(
      `${API_URL_COLLECTIONS}/${collection_id}/ratings`
    );

    if (collectionRatings.status === SUCCESS_STATUS_CODE) {
      req.collectionRatings = collectionRatings.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error getting ratings for collection"
      )
    );
  }
};

exports.removeRatingFromCollection = async (req, res, next) => {
  const { collection_id, user_id } = req.params;
  try {
    const removeRating = await axios.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/ratings/${user_id}`
    );

    if (removeRating.status === SUCCESS_STATUS_CODE) {
      req.flash(
        "success",
        removeRating.data.success || "Rating removed from collection"
      );
      res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error removing rating from collection"
      )
    );
  }
};
