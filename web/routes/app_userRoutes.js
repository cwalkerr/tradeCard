const express = require("express");
const router = express.Router();
const loginController = require("../controllers/app_loginController.js");
const signupController = require("../controllers/app_signupController.js");

router.get("/login", loginController.renderLoginPage);
router.post("/login", loginController.loginController);

// temporary route for dashboard
router.get("/dashboard", (req, res) => {
  res.render("dashboard", { userID: req.session.userID });
});

router.get("/signup", signupController.renderSignupPage);
router.post("/signup", signupController.signupController);

module.exports = router;
