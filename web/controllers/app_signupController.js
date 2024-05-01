const axios = require("axios");
const sequelize = require("sequelize");

exports.renderSignupPage = (req, res) => {
  res.render("signup");
};

exports.signupController = async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  // deal with signup request
  try {
    const apiResponse = await axios.post("http://localhost:4000/auth/signup", {
      email,
      username,
      password,
      passwordCheck,
    });

    if (apiResponse.status === 200) {
      return res.render("/login", { success: apiResponse.data.success });
    }

    if (apiResponse.status === 400) {
      return res.render("/signup", { error: apiResponse.data.error });
    }
  } catch (err) {
    if (err instanceof sequelize.ValidationError) {
      const messages = err.errors.map((e) => e.message);
      res.render("signup", { error: messages });
    } else {
      res.render("signup", { error: err.message || "An error occurred" });
    }
  }
};
