const api = require("../../utility/refreshToken");

const API_URL_MESSAGES = "api/messages";
const SUCCESS_STATUS_CODE = 200;
const CREATED_STATUS_CODE = 201;

exports.getUserMessages = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const userMessages = await api.get(`${API_URL_MESSAGES}/${userId}`, {
      headers: { Authorization: `Bearer ${req.cookies.jwt}` },
    });
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
    userId: req.user.id,
  });
};

exports.getMessageThread = async (req, res, next) => {
  const userId = req.user.id;
  const otherUserId = req.params.otherUserId;

  try {
    const messageThread = await api.get(
      `${API_URL_MESSAGES}/${userId}/${otherUserId}`,
      { headers: { Authorization: `Bearer ${req.cookies.jwt}` } }
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
  if (req.messageThread[0].sender.username === req.user.username) {
    otherUserName = req.messageThread[0].receiver.username;
  } else {
    otherUserName = req.messageThread[0].sender.username;
  }

  res.render("messageThread", {
    messages: req.messageThread,
    loggedInUser: req.user.username,
    userId: req.user.id,
    otherUserId: req.params.otherUserId,
    otherUserName: otherUserName,
  });
};

exports.sendMessage = async (req, res, next) => {
  const receiverId = req.params.otherUserId;
  const { message } = req.body;
  const senderId = req.user.id;

  try {
    const newMessage = await api.post(
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
    console.log(err);
    next(
      new Error(
        err.response.data.error || err.message || "Error sending message"
      )
    );
    return;
  }
};
