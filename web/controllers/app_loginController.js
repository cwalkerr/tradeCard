const axios = require("axios");

exports.renderLoginPage = (req, res) => {
  res.render("login", { error: "" });
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
      res.cookie("jwt", apiResponse.data.accessToken, {
        httpOnly: true,
        maxAge: 600000,
      });

      res.cookie("refreshJwt", apiResponse.data.refreshToken, {
        httpOnly: true,
        maxAge: 86400000,
      });
      return res.render("dashboard", { success: apiResponse.data.success });
    }
  } catch (err) {
    if (err.response.status === 400) {
      return res.render("login", { error: err.response.data.error });
    }

    res.render("login", { error: "An error occurred, please try again" });
  }
};
