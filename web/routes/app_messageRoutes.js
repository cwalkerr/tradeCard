const express = require("express");
const router = express.Router();
const messageController = require("../controllers/app_messageController.js");
const {
  verifyLoggedIn,
  catchError,
} = require("../../middleware/middleware.js");

router
  .route("/messages")
  .all(verifyLoggedIn("You must be logged in to view messages"))
  .get(
    messageController.getUserMessages,
    messageController.displayMessageBoard,
    catchError("/messages")
  );

router
  .route("/messages/:otherUserId")
  .all(verifyLoggedIn("You must be logged in to view messages"))
  .get(
    messageController.getMessageThread,
    messageController.displayMessageThread,
    catchError("/messages")
  )
  .post(messageController.sendMessage, catchError("/messages"));

module.exports = router;
