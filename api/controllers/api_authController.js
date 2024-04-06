const express = require("express");
const User = require("../models/userModel.js")();
const Sequelize = require("sequelize");

/**
 * API controller to register a new user
 */
exports.signup = async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;
  console.log(req.body); // debug

  // pre-validation checks
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  if (password !== passwordCheck) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // check if user already exists
  let user = await User.findAll({
    where: {
      email: email,
    },
  });

  // if user found return error
  if (user.length > 0) {
    return res
      .status(400)
      .json({ error: "This email is already in use, please login" });
  }

  // create user

  try {
    user = await User.create({
      email: email,
      username: username,
      password: password,
    });

    return res
      .status(200)
      .json({ success: "You are now registered and can log in" });
  } catch (err) {
    console.log(err); //  debug
    if (err instanceof Sequelize.ValidationError) {
      const errorMessage = err.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    } else {
      return res
        .status(400)
        .json({ error: err.message || "An error occurred" });
    }
  }
};

/**
 * API controller to login a user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // pre-validation checks
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    // find user by email
    let user = await User.findOne({
      where: {
        email: email,
      },
    }); // email is unique

    // if user not found return error
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    // check if password matches

    if (await user.checkPassword(password)) {
      return res.status(200).json({ success: "Login successful" });
    } else {
      return res.status(400).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.log(err); // debug
    return res.status(400).json({ error: "An error occurred" });
  }
};
