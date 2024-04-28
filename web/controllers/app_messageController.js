const axios = require("axios");

const API_URL_MESSAGES = "http://localhost:4000/api/messages";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

exports.getUserMessages = async (req, res, next) => {
  const userId = req.session.userID;

  try {
    const userMessages = await axios.get(`${API_URL_MESSAGES}/${userId}`);
    if (userMessages.status === SUCCESS_STATUS_CODE) {
      req.userMessages = userMessages.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error || err.message || "Error getting user messages"
      )
    );
    return;
  }
};

exports.displayMessageBoard = (req, res) => {
  res.render("messages", {
    messages: req.userMessages,
    userId: req.session.userID,
  });
};

exports.getMessageThread = async (req, res, next) => {
  const userId = req.session.userID;
  const otherUserId = req.params.otherUserId;

  try {
    const messageThread = await axios.get(
      `${API_URL_MESSAGES}/${userId}/${otherUserId}`
    );
    if (messageThread.status === SUCCESS_STATUS_CODE) {
      req.messageThread = messageThread.data;
      next();
    }
  } catch (err) {
    next(
      new Error(
        err.response.data.error || err.message || "Error getting message thread"
      )
    );
    return;
  }
};

exports.displayMessageThread = (req, res) => {
  let otherUserName;
  if (req.messageThread[0].sender.username === req.session.username) {
    otherUserName = req.messageThread[0].receiver.username;
  } else {
    otherUserName = req.messageThread[0].sender.username;
  }

  res.render("messageThread", {
    messages: req.messageThread,
    loggedInUser: req.session.username,
    userId: req.session.userID,
    otherUserId: req.params.otherUserId,
    otherUserName: otherUserName,
  });
};

exports.sendMessage = async (req, res, next) => {
  const receiverId = req.params.otherUserId;
  const { message } = req.body;
  const senderId = req.session.userID;

  console.log(receiverId, message, senderId);

  try {
    const newMessage = await axios.post(
      `${API_URL_MESSAGES}/${senderId}/${receiverId}`,
      {
        message: message,
      }
    );

    if (newMessage.status === CREATED_STATUS_CODE) {
      //   req.flash("success", "Message sent successfully");
      return res.redirect(`/messages/${receiverId}`);
    }
  } catch (err) {
    console.log(err);
    next(
      new Error(
        err.response.data.error || err.message || "Error sending message"
      )
    );
    return;
  }
};
