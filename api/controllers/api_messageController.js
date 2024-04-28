const { User, Message } = require("../models/userModel.js");

exports.getUserMessages = async (req, res) => {
  try {
    const messages = await Message.getUserMessages(req.params.userId);
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error getting user messages" });
  }
};

exports.getMessageThread = async (req, res) => {
  try {
    const messages = await Message.getMessageThread(
      req.params.userId,
      req.params.otherUserId
    );
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error getting message thread" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    await Message.create({
      sender_id: req.params.userId,
      receiver_id: req.params.otherUserId,
      body: req.body.message,
      sent_at: new Date(),
    });
    res.status(201).json("Message sent");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error sending message" });
  }
};

exports.markMessageRead = async (req, res) => {
  try {
    await Message.update(
      { is_read: true },
      {
        where: {
          receiver_id: req.params.userId,
          sender_id: req.params.otherUserId,
        },
      }
    );
    res.status(200).json("Message read");
  } catch (err) {
    res.status(500).json({ error: "Error marking message as read" });
  }
};
