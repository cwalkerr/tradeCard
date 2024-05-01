const api = require("../../utility/refreshToken");

const API_URL_COLLECTIONS = "/api/collections";
const SUCCESS_STATUS_CODE = 200;

exports.getCollectionRatings = async (req, res, next) => {
  const collection_id = req.params.collection_id;

  try {
    const collectionRatings = await api.get(
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
    const removeRating = await api.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/ratings/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (removeRating.status === SUCCESS_STATUS_CODE) {
      res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    console.log(err);
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error removing rating from collection"
      )
    );
  }
};
