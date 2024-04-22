const {
  Wishlist,
  WishlistCard,
  Card,
} = require("../models/modelAssosiations.js");

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

exports.getCardsInWishlist = async (req, res) => {
  const page = Number(req.query.page) || 1;

  try {
    const wishListCards = await WishlistCard.findAll({
      where: {
        wishlist_id: req.params.id,
      },
      attributes: ["card_id"],
    });

    if (!wishListCards) {
      return res.status(404).json({ error: "No cards in wishlist" });
    }
    const cardIds = wishListCards.map((card) => card.card_id);
    const cards = await Card.getCardDetails({ card_id: cardIds }, page);

    return res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error getting cards" });
  }
};

exports.addCardToWishlist = async (req, res) => {
  const { wishlist_id, card_id } = req.params;

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
  const { wishlist_id, card_id } = req.params;

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
