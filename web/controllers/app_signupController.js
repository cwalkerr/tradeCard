const axios = require("axios");

exports.renderSignupPage = (req, res) => {
  // render signup page
  res.render("signup", { error: req.flash("error") });
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

    // success response
    if (apiResponse.status === 200) {
      req.flash("success", apiResponse.data.success);
      return res.redirect("/login");
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      console.log("Error message: " + err.response.data.error);
      if (
        err.response.data.error == "This email is already in use, please login"
      ) {
        req.flash("error", err.response.data.error);
        return res.redirect("/login");
      }
    } else {
      console.log("An error occurred");
    }
    req.flash("error", err.response.data.error || "An error occurred");
    return res.redirect("/signup");
  }
};
