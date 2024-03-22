const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("login", { message: req.flash("success") });
});

module.exports = router;
