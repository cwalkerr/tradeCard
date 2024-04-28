const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

// Define the User model with validation
const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Invalid email format",
        },
        len: {
          args: [0, 124],
          msg: "Email too long",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be empty",
        },
        isPasswordValid(value) {
          if (!validator.isStrongPassword(value)) {
            throw new Error(
              "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit and one special character"
            );
          }

          if (value.length > 124) {
            throw new Error("Password is too long");
          }
        },
      },
    },
  },

  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 13);
      },
    },
    tableName: "user",
    timestamps: false,
    freezeTableName: true,
  }
);

const Message = sequelize.define(
  "Message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    tableName: "message",
    timestamps: false,
    freezeTableName: true,
  }
);

User.hasMany(Message, {
  foreignKey: "receiver_id",
  as: "receivedMessages",
});
User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});
Message.belongsTo(User, {
  foreignKey: "receiver_id",
  as: "receiver",
});
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
});

User.prototype.checkPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log("Error checking password", err);
  }
};

Message.getUserMessages = async function (userId) {
  try {
    const messages = await this.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["username"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["username"],
        },
      ],
      order: [["sent_at", "DESC"]],
    });

    return messages;
  } catch (err) {
    console.log("Error getting user messages", err);
  }
};

Message.getMessageThread = async function (userId, otherUserId) {
  try {
    const messages = await this.findAll({
      where: {
        [Op.or]: [
          {
            sender_id: userId,
            receiver_id: otherUserId,
          },
          {
            sender_id: otherUserId,
            receiver_id: userId,
          },
        ],
      },
      attributes: { exclude: ["receiver_id", "is_read"] },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["username"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["username"],
        },
      ],
      order: [["sent_at", "ASC"]],
    });

    return messages;
  } catch (err) {
    console.log("Error getting message thread", err);
  }
};

module.exports = { User, Message };
