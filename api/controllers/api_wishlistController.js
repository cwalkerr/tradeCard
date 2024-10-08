const {
  Wishlist,
  WishlistCard,
  Card,
} = require("../models/modelAssosiations.js");

const apiError = require("../../utility/customError.js");
const { tryCatch } = require("../../utility/tryCatch.js");

exports.verifyWishlistOwner = tryCatch(async (req, res, next) => {
  const wishlist = await Wishlist.findByPk(req.params.wishlist_id);

  if (!wishlist) {
    throw new apiError("Wishlist not found", 404);
  }

  if (wishlist.user_id !== req.user.id) {
    throw new apiError("Not authorised to access this wishlist", 403);
  }

  next();
});

exports.getWishlist = tryCatch(async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    throw new apiError("Missing user_id in query", 400);
  }
  if (Number(user_id) !== req.user.id) {
    throw new apiError("Not authorised to access this wishlist", 403);
  }
  const wishlist = await Wishlist.findOne({
    where: {
      user_id: user_id,
    },
  });
  return res.status(200).json(wishlist);
});

exports.getCardsInWishlist = async (req, res) => {
  const page = Number(req.query.page) || 1;

  try {
    const wishListCards = await WishlistCard.findAll({
      where: {
        wishlist_id: req.params.wishlist_id,
      },
      attributes: ["card_id"],
      raw: true,
    });

    if (wishListCards.length === 0) {
      return res.json(null);
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
