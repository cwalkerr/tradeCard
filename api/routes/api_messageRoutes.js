const express = require("express");
const router = express.Router();
const messageController = require("../controllers/api_messageController.js");
const {
  authenticateToken,
  verifyUserId,
} = require("../../middleware/authMiddleware.js");

router.get(
  "/messages/:userId",
  authenticateToken,
  verifyUserId,
  messageController.getUserMessages
);
router
  .route("/messages/:userId/:otherUserId")
  .all(authenticateToken, verifyUserId)
  .get(messageController.getMessageThread)
  .post(messageController.sendMessage)
  .put(messageController.markMessageRead);

module.exports = router;
