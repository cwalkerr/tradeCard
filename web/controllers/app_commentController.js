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
    return res.render("dashboard", {
      error:
        err.response.data.error ||
        err.message ||
        "Error getting collection comments",
      success: "",
    });
  }
};

exports.addCommentToCollection = async (req, res, next) => {
  const { collection_id } = req.params;
  const { comment } = req.body;
  const user_id = req.user.id;

  try {
    const addComment = await axios.post(
      `${API_URL_COLLECTIONS}/${collection_id}/comments`,
      {
        comment: comment,
        user_id: user_id,
      },
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (addComment.status === CREATED_STATUS_CODE) {
      return res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    const error = new URLSearchParams({
      error: err.response.data.error || err.message || "Error adding comment",
    }).toString();
    return res.redirect(`/collections/${collection_id}/cards?${error}`);
  }
};

exports.deleteCommentFromCollection = async (req, res, next) => {
  const { comment_id, collection_id } = req.params;

  try {
    const deleteComment = await axios.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/comments/${comment_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (deleteComment.status === SUCCESS_STATUS_CODE) {
      return res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    const error = new URLSearchParams({
      error: err.response.data.error || err.message || "Error deleting comment",
    }).toString();
    return res.redirect(`/collections/${collection_id}/cards?${error}`);
  }
};
