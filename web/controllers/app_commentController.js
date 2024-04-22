const axios = require("axios");

const API_URL_COLLECTIONS = "http://localhost:4000/api/collections";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

exports.getCollectionComments = async (req, res, next) => {
  const collection_id = req.params.collection_id;
  try {
    const collectionComments = await axios.get(
      `${API_URL_COLLECTIONS}/${collection_id}/comments`
    );

    if (collectionComments.status === SUCCESS_STATUS_CODE) {
      req.collectionComments = collectionComments.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error getting collection comments"
      )
    );
    return;
  }
};

exports.addCommentToCollection = async (req, res, next) => {
  const { collection_id } = req.params;
  const { comment } = req.body;
  const user_id = req.session.userID;

  try {
    const addComment = await axios.post(
      `${API_URL_COLLECTIONS}/${collection_id}/comments`,
      {
        comment: comment,
        user_id: user_id,
      }
    );

    if (addComment.status === CREATED_STATUS_CODE) {
      return res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    next(
      new Error(err.response.data.error || err.message || "An error occurred")
    );
    return;
  }
};

exports.deleteCommentFromCollection = async (req, res, next) => {
  const { comment_id, collection_id } = req.params;

  try {
    const deleteComment = await axios.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/comments/${comment_id}`
    );

    if (deleteComment.status === SUCCESS_STATUS_CODE) {
      return res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    next(
      new Error(err.response.data.error || err.message || "An error occurred")
    );
    return;
  }
};
