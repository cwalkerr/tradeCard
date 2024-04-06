const express = require("express");
const router = express.Router();
const authController = require("../controllers/api_authController.js");

// define routes for api endpoints for user registration and login
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
