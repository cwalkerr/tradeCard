const express = require("express");
const router = express.Router();
const authController = require("../controllers/api_authController.js");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

module.exports = router;
