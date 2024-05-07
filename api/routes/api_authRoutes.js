const express = require("express");
const router = express.Router();
const authController = require("../controllers/api_authController.js");
const errorHandler = require("../../middleware/errorHandler.js");

router.post("/signup", authController.signup, errorHandler);
router.post("/login", authController.login, errorHandler);
router.post("/refresh", authController.refresh, errorHandler);

module.exports = router;
