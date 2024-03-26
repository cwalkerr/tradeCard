const express = require("express");
const router = express.Router();
const db = require("../db");
const { checkPassword, validateEmail } = require("../utility.js");

router.get("/", (req, res) => {
  res.render("login", {
    success: req.flash("success"),
    email: req.flash("email"),
    password: req.flash("password"),
    error: req.flash("error"),
  });
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  const findUser = "SELECT * FROM user WHERE email = ?";

  try {
    // input validation - change to flash messages
    if (!email || !password)
      return res.status(400).send("Please enter email and password");
    if (!validateEmail(email))
      return res.status(400).send("Invalid email format");

    db.query(findUser, [email], async (err, result) => {
      if (err) console.log(err);

      console.log(result);
      // check if email exists
      if (result.length === 0) {
        req.flash("email", "Email not found");
        return res.redirect("/login");
      }

      const user = result[0];
      const hashedPassword = user.password;

      // check if password matches
      if (await checkPassword(password, hashedPassword)) {
        console.log("Password is correct");

        const sessionObj = req.session;
        console.log("Session object:", sessionObj);

        sessionObj.authenticated = result[0].user_id;

        console.log("User ID:", result[0].user_id);
        res.redirect("/dashboard");
      } else {
        req.flash("password", "Incorrect password");
        res.redirect("/login");
      }
    });
  } catch {
    console.log(err);
    return res.status(500).send("ERROR");
  }
});

module.exports = router;
