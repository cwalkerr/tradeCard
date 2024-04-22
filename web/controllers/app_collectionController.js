const axios = require("axios");

const API_URL_COLLECTIONS = "http://localhost:4000/api/collections";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

/**
 * gets collections based on user_id/collection_id or all
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getCollections = async (req, res, next) => {
  let url;
  const collection_id = req.params.collection_id;

  if (
    req.originalUrl.includes("/user") ||
    (req.originalUrl.startsWith("/cards/") && req.session.userID) // this is a workaround to get user collections loaded into the card details page
  ) {
    url = `${API_URL_COLLECTIONS}?user_id=${req.session.userID}`;
  } else if (collection_id) {
    url = `${API_URL_COLLECTIONS}/${req.params.collection_id}`;
  } else {
    url = `${API_URL_COLLECTIONS}`;
  }

  try {
    const collections = await axios.get(url);

    if (collections.status === SUCCESS_STATUS_CODE) {
      req.collections = collections.data;
      console.log("getCollections : ", req.collections);
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error getting user collections"
      )
    );
    return;
  }
};

/**
 * renders the collections page
 * @param {*} req
 * @param {*} res
 */
exports.renderCollections = (req, res) => {
  res.render("collections", {
    success: req.flash("success"),
    error: req.flash("error"),
    collections: req.collections,
    userId: req.session.userID,
    route: req.originalUrl,
  });
};

/**
 * creates a collection for the session user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.createCollection = async (req, res, next) => {
  const { name, description } = req.body;
  const userId = req.session.userID;
  try {
    const createCollection = await axios.post(`${API_URL_COLLECTIONS}/create`, {
      name: name,
      description: description,
      user_id: userId,
    });

    console.log("createCollection : ", createCollection);
    console.log("createCollection status : ", createCollection.status);
    console.log("createCollection data : ", createCollection.data);

    if (createCollection.status === CREATED_STATUS_CODE) {
      console.log(
        "createCollection.data.success : ",
        createCollection.data.success
      );
      req.flash(
        "success",
        createCollection.data.success || "Collection created"
      );
      return res.redirect("/collections/user");
    }
  } catch (err) {
    console.log("createCollection error : ", err);
    next(
      new Error(
        err.response.data.error || err.message || "Error creating collection"
      )
    );
    return;
  }
};

/**
 * Deletes a collection
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.deleteCollection = async (req, res, next) => {
  try {
    const deleteCollection = await axios.delete(
      `${API_URL_COLLECTIONS}/${req.params.id}?user_id=${req.session.userID}`
    );

    if (deleteCollection.status === SUCCESS_STATUS_CODE) {
      req.flash(
        "success",
        deleteCollection.data.success || "Collection deleted"
      );
      return res.redirect("/collections/user");
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error || err.message || "Error deleting collection"
      )
    );
    return;
  }
};

/**
 * gets the cards in a collection
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getCardsInCollection = async (req, res, next) => {
  const collection_id = req.params.collection_id;
  try {
    const cardsInCollection = await axios.get(
      `${API_URL_COLLECTIONS}/${collection_id}/cards`
    );

    if (cardsInCollection.status === SUCCESS_STATUS_CODE) {
      req.cardsInCollection = cardsInCollection.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error getting cards in collection"
      )
    );
  }
};

/**
 * adds card to collection
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.addCardToCollection = async (req, res, next) => {
  const card_id = req.params.card_id;
  const collection_id = req.body.collection_id;

  try {
    const addCard = await axios.post(
      `${API_URL_COLLECTIONS}/${collection_id}/cards/${card_id}`
    );

    if (addCard.status === CREATED_STATUS_CODE) {
      req.flash("success", addCard.data.success || "Card added to collection");
      return res.redirect(`/cards/${card_id}`);
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error adding card to collection"
      )
    );
    return;
  }
};

/**
 * removes card from collection
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.removeCardFromCollection = async (req, res, next) => {
  const { collection_id, card_id } = req.params;

  try {
    const removeCard = await axios.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/cards/${card_id}`
    );

    if (removeCard.status === SUCCESS_STATUS_CODE) {
      req.flash(
        "success",
        removeCard.data.success || "Card removed from collection" // success message doesnt work here
      );
      return res.redirect(`/collections/${collection_id}/cards`);
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error removing card from collection"
      )
    );
    return;
  }
};
