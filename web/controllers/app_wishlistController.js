const api = require("../../utility/refreshToken");
const API_URL_WISHLIST = "/api/wishlist";
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
      const wishlist = await api.get(
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
      console.log(err);
      next(
        new Error(
          err.response.data.error || err.message || "Error getting wishlist"
        )
      );
      return;
    }
  }
  next();
};

exports.getCardsInWishlist = async (req, res, next) => {
  const wishlist_id = req.wishlist.wishlist_id;
  console.log(req.cookies.jwt);

  try {
    const wishListCards = await api.get(`${API_URL_WISHLIST}/${wishlist_id}`, {
      headers: {
        Authorization: `Bearer ${req.cookies.jwt}`,
      },
    });
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
  console.log(req.cookies.jwt);
  try {
    const addCard = await api.post(
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
    console.log(err);
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
    const removeCard = await api.delete(
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
    console.log(err);
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
