const { Comment, User } = require("../models/modelAssosiations.js");

exports.getAllComments = async (req, res) => {
  const collection_id = req.params.id;

  try {
    const comments = await Comment.findAll({
      where: {
        collection_id: collection_id,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ error: "Error getting comments" });
  }
};

exports.addComment = async (req, res) => {
  const collection_id = req.params.id;
  const { comment, user_id } = req.body;

  if (user_id !== req.user.id) {
    return res.status(403).json({ error: "Not authorised" });
  }

  try {
    await Comment.create({
      collection_id: collection_id,
      comment: comment,
      user_id: user_id,
    });

    return res.status(201).json({ success: "Comment added" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error adding comment" });
  }
};

exports.deleteComment = async (req, res) => {
  const comment_id = req.params.comment_id;

  try {
    const userVerify = await Comment.findOne({
      where: {
        user_id: req.user.id,
        comment_id: comment_id,
      },
    });
    if (!userVerify) {
      return res.status(403).json({ error: "Not authorised" });
    }

    await Comment.destroy({
      where: {
        comment_id: comment_id,
      },
    });
    return res.status(200).json({ success: "Comment deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error deleting comment" });
  }
};
