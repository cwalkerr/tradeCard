const express = require("express");
const router = express.Router();
const messageController = require("../controllers/api_messageController.js");

router.get("/messages/:userId", messageController.getUserMessages);
router
  .route("/messages/:userId/:otherUserId")
  .get(messageController.getMessageThread)
  .post(messageController.sendMessage)
  .put(messageController.markMessageRead);

module.exports = router;
