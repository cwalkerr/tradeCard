const { Rating } = require("../models/modelAssosiations.js");
const { tryCatch } = require("../../utility/tryCatch.js");
const apiError = require("../../utility/customError.js");

exports.getRatingDetails = async (req, res) => {
  const collection_id = req.params.id;

  try {
    const ratings = await Rating.getRatingDetails(collection_id);
    req.ratings = ratings;
    return res.status(200).json(ratings);
  } catch (err) {
    return res.status(500).json({ error: "Error getting rating details" });
  }
};

exports.addRating = tryCatch(async (req, res) => {
  const collection_id = req.params.id;
  const { rating, user_id } = req.body;

  if (!rating || !user_id) {
    throw new apiError("Missing fields in body", 400);
  }

  if (Number(user_id) !== req.user.id) {
    throw new apiError("Not authorised to add a rating as this user", 403);
  }

  await Rating.create({
    collection_id: collection_id,
    rating: rating,
    user_id: user_id,
  });
  return res.status(201).json({ success: "Rating added" });
});

exports.updateRating = tryCatch(async (req, res) => {
  const collection_id = req.params.id;
  const { rating, user_id } = req.body;

  if (!rating || !user_id) {
    throw new apiError("Missing fields in body", 400);
  }

  if (Number(user_id) !== req.user.id) {
    throw new apiError("Not authorised to update the rating as this user", 403);
  }
  await Rating.update(
    {
      rating: rating,
    },
    {
      where: {
        collection_id: collection_id,
        user_id: user_id,
      },
    }
  );
  return res.status(200).json({ success: "Rating updated" });
});

// validity of user_id is checked in the middleware where userId is in the params
exports.deleteRating = tryCatch(async (req, res) => {
  const collection_id = req.params.id;
  const user_id = req.params.userId;

  const removeRating = await Rating.destroy({
    where: {
      collection_id: collection_id,
      user_id: user_id,
    },
  });
  if (!removeRating || removeRating === 0) {
    throw new apiError("Rating not found", 404);
  }

  return res.status(200).json({ success: "Rating deleted" });
});

exports.getUserRating = async (req, res) => {
  const collection_id = req.params.id;
  const user_id = req.params.userId;
  try {
    const rating = await Rating.findOne({
      where: {
        collection_id: collection_id,
        user_id: user_id,
      },
      attributes: ["rating"],
    });

    if (!rating) {
      return res.status(200).json(0);
    }
    return res.status(200).json(rating.rating);
  } catch (err) {
    return res.status(500).json({ error: "Error getting user rating" });
  }
};
