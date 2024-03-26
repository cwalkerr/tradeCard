const express = require("express");
const router = express.Router();
const db = require("../db");
const { validateEmail, hashPassword } = require("../utility.js");

router.get("/", (req, res) => {
  res.render("signup", { error: req.flash("error") });
});

// register user
router.post("/", async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  try {
    // input validation
    if (!email || !username || !password) {
      req.flash("error", "Please enter all fields");
      return res.redirect("/signup");
    }

    if (password !== passwordCheck) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/signup");
    }

    if (!validateEmail(email)) {
      req.flash("error", "Invalid email format");
      return res.redirect("/signup");
    }

    // check if email already exists
    db.query(
      "SELECT COUNT(*) AS count FROM user WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) console.log(err);
        if (result[0].count > 0) {
          req.flash("error", "Email already exists, please login");
          return res.redirect("/login");
        } else {
          // hash password
          const hashedPassword = await hashPassword(password);

          // insert user into database
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
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
