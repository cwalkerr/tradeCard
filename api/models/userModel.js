const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");

module.exports = () => {
  // Define the User model with validation
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
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
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
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

  User.prototype.checkPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (err) {
      console.log("Error checking password", err);
    }
  };

  return User;
};
