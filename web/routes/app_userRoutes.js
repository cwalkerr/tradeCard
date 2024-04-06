const express = require("express");
const router = express.Router();
const loginController = require("../controllers/app_loginController.js");
const signupController = require("../controllers/app_signupController.js");

router.get("/login", loginController.renderLoginPage);
router.post("/login", loginController.loginController);

router.get("/signup", signupController.renderSignupPage);
router.post("/signup", signupController.signupController);

module.exports = router;
