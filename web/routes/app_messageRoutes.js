const express = require("express");
const router = express.Router();
const messageController = require("../controllers/app_messageController.js");
const { verifyLoggedIn } = require("../../middleware/middleware.js");

router
  .route("/messages")
  .all(verifyLoggedIn("You must be logged in to view messages"))
  .get(
    messageController.getUserMessages,
    messageController.displayMessageBoard
  );

router
  .route("/messages/:otherUserId")
  .all(verifyLoggedIn("You must be logged in to view messages"))
  .get(
    messageController.getMessageThread,
    messageController.displayMessageThread
  )
  .post(messageController.sendMessage);

module.exports = router;
