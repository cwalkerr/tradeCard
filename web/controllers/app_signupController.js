const axios = require("axios");
const API_ENDPOINT = "http://localhost:4000/auth/signup";

exports.renderSignupPage = (req, res) => {
  res.render("signup", { error: "" });
};

exports.signupController = async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  if (!email || !username || !password) {
    return res.render("signup", { error: "Please enter all fields" });
  }

  if (password !== passwordCheck) {
    return res.render("signup", { error: "Passwords do not match" });
  }

  // deal with signup request
  try {
    const apiResponse = await axios.post(API_ENDPOINT, {
      email,
      username,
      password,
      passwordCheck,
    });

    if (apiResponse.data.success) {
      return res.render("login", {
        success: apiResponse.data.success,
        error: "",
      });
    }
  } catch (err) {
    return res.render("signup", {
      error: err.response.data.error || "An error occurred",
    });
  }
};
