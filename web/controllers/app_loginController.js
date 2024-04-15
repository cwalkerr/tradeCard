const axios = require("axios");

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
      console.log(apiResponse);
      // create session on successful login
      let sessionObj = req.session;
      sessionObj.userID = apiResponse.data.user_id;
      return res.redirect("/dashboard");
    }
  } catch (err) {
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("http://localhost:3000/login");
  }
};
