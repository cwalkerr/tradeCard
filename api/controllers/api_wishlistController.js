const { Wishlist, WishlistCard } = require("../models/modelAssosiations.js");

exports.getWishlist = async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const wishlist = await Wishlist.findOne({
      where: {
        user_id: user_id,
      },
    });
    return res.status(200).json(wishlist);
  } catch (err) {
    return res.status(500).json({ error: "Error getting wishlist" });
  }
};

exports.getCardsInWishlist = async (req, res, next) => {
  const wishlist = await Wishlist.findByPk(req.params.wishlist_id);

  try {
    const wishlistCards = await WishlistCard.getCardsInWishlist(
      wishlist.wishlist_id
    );
    if (!wishlistCards) {
      return res.status(404).json({ error: "No cards in wishlist" });
    }

    req.query.cardIds = wishlistCards.join(",");
    next();
  } catch (err) {
    return res.status(500).json({ error: "Error getting cards in wishlist" });
  }
};

exports.addCardToWishlist = async (req, res) => {
  const { card_id } = req.body;
  const wishlist_id = req.params.wishlist_id;

  try {
    await WishlistCard.create({
      wishlist_id: wishlist_id,
      card_id: card_id,
    });

    return res.status(201).json({ success: "Card added to wishlist" });
  } catch (err) {
    return res.status(500).json({ error: "Error adding card to wishlist" });
  }
};

exports.removeCardFromWishlist = async (req, res) => {
  const { card_id, wishlist_id } = req.params;

  try {
    await WishlistCard.destroy({
      where: {
        wishlist_id: wishlist_id,
        card_id: card_id,
      },
    });

    return res.status(200).json({ success: "Card removed from wishlist" });
  } catch (err) {
    return res.status(500).json({ error: "Error removing card from wishlist" });
  }
};
