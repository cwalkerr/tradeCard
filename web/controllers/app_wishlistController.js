const axios = require("axios");

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
      `http://localhost:4000/api/wishlist?user_id=${req.session.userID}`
    );

    if (wishlist.status === 200) {
      const wishlistId = wishlist.data.wishlist_id;
      req.wishlistId = wishlistId;
      req.wishlistOwner = req.session.userID;
    }
    next();
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("/dashboard");
  }
};

exports.addCardToWishlist = async (req, res) => {
  const { wishlist_id, card_id } = req.body;

  try {
    const addCard = await axios.post(
      `http://localhost:4000/api/wishlist/${wishlist_id}/cards`,
      {
        card_id: card_id,
      }
    );

    if (addCard.status === 201) {
      req.flash("success", addCard.data.success || "Card added to wishlist");
    }
    return res.redirect(`/cards/${card_id}`);
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect(`/cards/${card_id}`);
  }
};

exports.removeCardFromWishlist = async (req, res) => {
  const { card_id, wishlist_id } = req.params;

  try {
    const removeCard = await axios.delete(
      `http://localhost:4000/api/wishlist/${wishlist_id}/cards/${card_id}`
    );

    if (removeCard.status === 200) {
      req.flash(
        "success",
        removeCard.data.success || "Card removed from wishlist"
      );
    }
    res.redirect("/wishlist");
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect(`/wishlist`);
  }
};
