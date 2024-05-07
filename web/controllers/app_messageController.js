const axios = require("axios");

const API_URL_MESSAGES = "http://localhost:4000/api/messages";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

exports.getUserMessages = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const userMessages = await axios.get(`${API_URL_MESSAGES}/${userId}`, {
      headers: { Authorization: `Bearer ${req.cookies.jwt}` },
    });
    if (userMessages.status === SUCCESS_STATUS_CODE) {
      req.userMessages = userMessages.data;
      next();
    }
  } catch (err) {
    return res.render("dashboard", {
      error:
        err.response.data.error || err.message || "Error getting user messages",
      success: "",
    });
  }
};

exports.displayMessageBoard = (req, res) => {
  let success;
  let error;
  req.query.success ? (success = req.query.success) : (success = "");
  req.query.error ? (error = req.query.error) : (error = "");
  res.render("messages", {
    messages: req.userMessages,
    userId: req.user.id,
    success: success,
    error: error,
  });
};

exports.getMessageThread = async (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.otherUserId;

  try {
    const messageThread = await axios.get(
      `${API_URL_MESSAGES}/${userId}/${otherUserId}`,
      { headers: { Authorization: `Bearer ${req.cookies.jwt}` } }
    );
    if (messageThread.status === SUCCESS_STATUS_CODE) {
      req.messageThread = messageThread.data;
      next();
    }
  } catch (err) {
    const error = new URLSearchParams({
      error:
        err.response.data.error ||
        err.message ||
        "Error getting message thread",
    }).toString();
    return res.redirect(`/messages?${error}`);
  }
};

exports.displayMessageThread = (req, res) => {
  let otherUserName;
  if (req.messageThread[0].sender.username === req.user.username) {
    otherUserName = req.messageThread[0].receiver.username;
  } else {
    otherUserName = req.messageThread[0].sender.username;
  }

  let success;
  let error;
  req.query.success ? (success = req.query.success) : (success = "");
  req.query.error ? (error = req.query.error) : (error = "");

  res.render("messageThread", {
    messages: req.messageThread,
    loggedInUser: req.user.username,
    userId: req.user.id,
    otherUserId: req.params.otherUserId,
    otherUserName: otherUserName,
    success: success,
    error: error,
  });
};

exports.sendMessage = async (req, res, next) => {
  const receiverId = req.params.otherUserId;
  const { message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = await axios.post(
      `${API_URL_MESSAGES}/${senderId}/${receiverId}`,
      {
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${req.cookies.jwt}`,
        },
      }
    );

    if (newMessage.status === CREATED_STATUS_CODE) {
      return res.redirect(`/messages/${receiverId}`);
    }
  } catch (err) {
    const error = new URLSearchParams({
      error: err.response.data.error || err.message || "Error sending message",
    }).toString();
    return res.redirect(`/messages/${receiverId}?${error}`);
  }
};
