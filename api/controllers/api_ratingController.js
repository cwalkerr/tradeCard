const { Rating } = require("../models/modelAssosiations.js");

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

exports.addRating = async (req, res) => {
  const collection_id = req.params.id;
  const { rating, user_id } = req.body;

  try {
    await Rating.create({
      collection_id: collection_id,
      rating: rating,
      user_id: user_id,
    });

    return res.status(201).json({ success: "Rating added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error adding rating" });
  }
};

exports.updateRating = async (req, res) => {
  const collection_id = req.params.id;
  const { rating, user_id } = req.body;

  try {
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error updating rating" });
  }
};

exports.deleteRating = async (req, res) => {
  const collection_id = req.params.id;
  const user_id = req.params.user_id;

  try {
    await Rating.destroy({
      where: {
        collection_id: collection_id,
        user_id: user_id,
      },
    });

    return res.status(200).json({ success: "Rating deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting rating" });
  }
};

exports.getUserRating = async (req, res) => {
  const collection_id = req.params.id;
  const user_id = req.params.user_id;

  try {
    const rating = await Rating.findOne({
      where: {
        collection_id: collection_id,
        user_id: user_id,
      },
      attributes: ["rating"],
    });
    return res.status(200).json(rating.rating); // just returns the number
  } catch (err) {
    return res.status(500).json({ error: "Error getting user rating" });
  }
};
