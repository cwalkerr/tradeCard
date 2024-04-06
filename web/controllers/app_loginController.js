const axios = require("axios");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
app.use(flash());

exports.renderLoginPage = (req, res) => {
  res.render("login", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
};

exports.loginController = async (req, res) => {
  // deal with login request
  const { email, password } = req.body;
  try {
    const apiResponse = await axios.post("http://localhost:4000/auth/login", {
      email,
      password,
    });

    if (apiResponse.status === 200) {
      req.flash("success", apiResponse.data.success);
      // create session on successful login
      sessionObj = req.session;
      sessionObj.authenticated = apiResponse.data.user_id;
      req.session.authenticated = true;
      console.log("sessionObj", sessionObj); // debug
      return res.redirect("http://localhost:3000/dashboard");
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      console.log("Error message: " + err.response.data.error);
    } else {
      console.log("An error occurred");
    }
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("http://localhost:3000/login");
  }
};
