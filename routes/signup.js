const express = require("express");
const router = express.Router();
const db = require("../db");
const { validateEmail, hashPassword } = require("../utility.js");

router.get("/", (req, res) => {
  res.render("signup");
});

// register user
router.post("/", async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  try {
    // input validation
    if (!email || !username || !password) {
      return res.status(400).send("Please enter email, username and password");
    }

    if (password !== passwordCheck) {
      return res.status(400).send("Passwords do not match");
    }

    if (!validateEmail(email)) {
      return res.status(400).send("Please enter a valid email");
    }

    // check if email already exists
    db.query(
      "SELECT COUNT(*) AS count FROM user WHERE email = ?",
      [email],
      (err, result) => {
        if (err) console.log(err);
        if (result[0].count > 0)
          return res.status(400).send("Email already exists");
      }
    );

    // hash password
    const hashedPassword = await hashPassword(password);

    db.query(
      "INSERT INTO user (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          // redirect to login page and flash message
          req.flash("success", "You are now registered and can log in");
          res.redirect("/login");
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
