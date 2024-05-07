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
  if (req.user && req.user.id) {
    try {
      const wishlist = await axios.get(
        `${API_URL_WISHLIST}?user_id=${req.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${req.cookies.jwt}`,
          },
        }
      );
      if (wishlist.status === SUCCESS_STATUS_CODE) {
        req.wishlist = wishlist.data;
        next();
      }
    } catch (err) {
      return res.render("dashboard", {
        error:
          err.response.data.error || err.message || "Error getting wishlist",
        success: "",
      });
    }
  } else {
    next();
  }
};

exports.getCardsInWishlist = async (req, res, next) => {
  const wishlist_id = req.wishlist.wishlist_id;

  try {
    const wishListCards = await axios.get(
      `${API_URL_WISHLIST}/${wishlist_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );
    if (wishListCards.status === SUCCESS_STATUS_CODE) {
      req.cardsInWishlist = wishListCards.data;
      next();
    }
  } catch (err) {
    return res.render("dashboard", {
      error: err.response.data.error || err.message || "Error getting wishlist",
      success: "",
    });
  }
};

exports.addCardToWishlist = async (req, res, next) => {
  const { wishlist_id, card_id } = req.params;

  try {
    const addCard = await axios.post(
      `${API_URL_WISHLIST}/${wishlist_id}/card/${card_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (addCard.status === CREATED_STATUS_CODE) {
      const success = new URLSearchParams({
        success: addCard.data.success || "Card added to wishlist",
      }).toString();
      return res.redirect(`/cards/${card_id}?${success}`);
    }
  } catch (err) {
    const error = new URLSearchParams({
      error:
        err.response.data.error ||
        err.message ||
        "Error adding card to wishlist",
    }).toString();
    return res.redirect(`/cards/${card_id}?${error}`);
  }
};

exports.removeCardFromWishlist = async (req, res, next) => {
  const { wishlist_id, card_id } = req.params;

  try {
    const removeCard = await axios.delete(
      `${API_URL_WISHLIST}/${wishlist_id}/card/${card_id}`,
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (removeCard.status === SUCCESS_STATUS_CODE) {
      return res.redirect(`/wishlist`);
    }
  } catch (err) {
    const error = new URLSearchParams({
      error:
        err.response.data.error ||
        err.message ||
        "Error removing card from wishlist",
    }).toString();
    return res.redirect(`/wishlist?${error}`);
  }
};
