const express = require("express");
const router = express.Router();
const loginController = require("../controllers/app_loginController.js");
const signupController = require("../controllers/app_signupController.js");
const { verifyLoggedIn } = require("../../middleware/middleware.js");

router
  .route("/login")
  .get(loginController.renderLoginPage)
  .post(loginController.loginController);

// temporary route for dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    error: "",
    success: "",
  });
});

router
  .route("/signup")
  .get(signupController.renderSignupPage)
  .post(signupController.signupController);

module.exports = router;
