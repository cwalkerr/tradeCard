const api = require("../../utility/refreshToken");

const API_URL_COLLECTIONS = "/api/collections";
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
  let headers = {};
  const collection_id = req.params.collection_id;

  if (
    req.originalUrl.includes("/user") ||
    (req.originalUrl.startsWith("/cards/") && req.user && req.user.id) // this is a workaround to get user collections loaded into the card details page
  ) {
    url = `${API_URL_COLLECTIONS}?user_id=${req.user.id}`;
  } else if (collection_id) {
    url = `${API_URL_COLLECTIONS}/${req.params.collection_id}`;
  } else {
    url = `${API_URL_COLLECTIONS}`;
  }
  console.log("url: ", url);

  if (req.user && req.user.id) {
    headers = {
      Authorization: `Bearer ${req.cookies.jwt}`,
    };
  }
  try {
    const collections = await api.get(url, {
      headers: headers,
    });

    if (collections.status === SUCCESS_STATUS_CODE) {
      req.collections = collections.data;
      next();
    }
  } catch (err) {
    console.log("getCollections error : ", err);
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
    collections: req.collections,
    route: req.originalUrl,
    userId: req.user ? req.user.id : null,
    success: "",
    error: "",
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
  try {
    const createCollection = await api.post(
      `${API_URL_COLLECTIONS}/create`,
      { name: name, description: description, user_id: req.user.id },
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (createCollection.status === CREATED_STATUS_CODE) {
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
    const deleteCollection = await api.delete(
      `${API_URL_COLLECTIONS}/${req.params.id}?user_id=${req.user.id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (deleteCollection.status === SUCCESS_STATUS_CODE) {
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
  const page = req.query.page || 1;
  try {
    const cardsInCollection = await api.get(
      `${API_URL_COLLECTIONS}/${collection_id}/cards?page=${page}`
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

  console.log("addCardToCollection req.body : ", req.body);
  console.log("addCardToCollection req.params : ", req.params);

  try {
    const addCard = await api.post(
      `${API_URL_COLLECTIONS}/${collection_id}/cards/${card_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (addCard.status === CREATED_STATUS_CODE) {
      const success = new URLSearchParams({
        success: addCard.data.success || "Card added to collection",
      }).toString();
      return res.redirect(`/cards/${card_id}?${success}`);
    }
  } catch (err) {
    console.log("addCardToCollection error : ", err);
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
    const removeCard = await api.delete(
      `${API_URL_COLLECTIONS}/${collection_id}/cards/${card_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (removeCard.status === SUCCESS_STATUS_CODE) {
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
