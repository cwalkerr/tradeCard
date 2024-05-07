const axios = require("axios");
const API_ENDPOINT = "http://localhost:4000/auth/login";

exports.renderLoginPage = (req, res) => {
  res.render("login", { error: "", success: "" });
};

exports.loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("login", { error: "Please enter all fields" });
  }

  try {
    const apiResponse = await axios.post(API_ENDPOINT, {
      email,
      password,
    });

    if (apiResponse.status === 200) {
      res.cookie("jwt", apiResponse.data.accessToken, {
        httpOnly: true,
        maxAge: 600000,
      });

      res.cookie("refreshJwt", apiResponse.data.refreshToken, {
        httpOnly: true,
        maxAge: 86400000,
      });
      return res.render("dashboard");
    }
  } catch (err) {
    return res.render("login", {
      error: err.response.data.error || "An error occurred",
      success: "",
    });
  }
};
