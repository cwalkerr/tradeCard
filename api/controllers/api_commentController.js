const { Comment, User } = require("../models/modelAssosiations.js");
const { tryCatch } = require("../../utility/tryCatch.js");
const apiError = require("../../utility/customError.js");

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

exports.addComment = tryCatch(async (req, res) => {
  const collection_id = req.params.id;
  const { comment, user_id } = req.body;

  if (!comment || !user_id) {
    throw new apiError("Missing fields in body", 400);
  }

  if (user_id !== req.user.id) {
    throw new apiError("Not authorised to add a comment as this user", 403);
  }

  await Comment.create({
    collection_id: collection_id,
    comment: comment,
    user_id: user_id,
  });

  return res.status(201).json({ success: "Comment added" });
});

exports.deleteComment = tryCatch(async (req, res) => {
  const comment_id = req.params.comment_id;

  const userVerify = await Comment.findOne({
    where: {
      user_id: req.user.id,
      comment_id: comment_id,
    },
  });
  if (!userVerify) {
    throw new apiError("Not authorised to delete this comment", 403);
  }
  const removeComment = await Comment.destroy({
    where: {
      comment_id: comment_id,
    },
  });
  if (removeComment === 0) {
    throw new apiError("Comment not found", 404);
  }

  return res.status(200).json({ success: "Comment deleted" });
});
