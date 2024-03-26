const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const sessionObj = req.session;

    if (sessionObj.authenticated) {
      return res.render("dashboard");
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
