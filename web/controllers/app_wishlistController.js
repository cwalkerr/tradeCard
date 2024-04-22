const axios = require("axios");
const API_URL_WISHLIST = "http://localhost:4000/api/wishlist";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

/**
 * gets the wishlist id of the session user
 * @param {} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
exports.getUserWishlist = async (req, res, next) => {
  try {
    const wishlist = await axios.get(
      `${API_URL_WISHLIST}?user_id=${req.session.userID}`
    );
    if (wishlist.status === SUCCESS_STATUS_CODE) {
      req.wishlist = wishlist.data; // this includes wishlist_id and user_id for view
      console.log("wishlist : ", req.wishlist);
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error || err.message || "Error getting wishlist"
      )
    );
    return;
  }
};

exports.getCardsInWishlist = async (req, res, next) => {
  const wishlist_id = req.wishlist.wishlist_id;

  try {
    const wishListCards = await axios.get(
      `${API_URL_WISHLIST}/${wishlist_id}/`
    );
    if (wishListCards.status === SUCCESS_STATUS_CODE) {
      req.cardsInWishlist = wishListCards.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error || err.message || "Error getting wishlist cards"
      )
    );
    return;
  }
};

exports.addCardToWishlist = async (req, res, next) => {
  const { wishlist_id, card_id } = req.params;
  try {
    const addCard = await axios.post(
      `${API_URL_WISHLIST}/${wishlist_id}/card/${card_id}`
    );

    if (addCard.status === CREATED_STATUS_CODE) {
      req.flash("success", addCard.data.success || "Card added to wishlist");
      return res.redirect(`/cards/${card_id}`);
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error adding card to wishlist"
      )
    );
    return;
  }
};

exports.removeCardFromWishlist = async (req, res, next) => {
  const { wishlist_id, card_id } = req.params;

  try {
    const removeCard = await axios.delete(
      `${API_URL_WISHLIST}/${wishlist_id}/card/${card_id}`
    );

    if (removeCard.status === SUCCESS_STATUS_CODE) {
      req.flash(
        "success",
        removeCard.data.success || "Card removed from wishlist"
      );
      return res.redirect(`/wishlist`);
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error ||
          err.message ||
          "Error removing card from wishlist"
      )
    );
    return;
  }
};
