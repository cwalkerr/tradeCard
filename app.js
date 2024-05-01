const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");

// Route imports
const userRoutes = require("./web/routes/app_userRoutes");
const cardRoutes = require("./web/routes/app_cardRoutes");
const collectionRoutes = require("./web/routes/app_collectionRoutes");
const wishlistRoutes = require("./web/routes/app_wishlistRoutes");
const messageRoutes = require("./web/routes/app_messageRoutes");

// initialize express app
const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "web/views"));

// Middleware
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "web", "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist"))
); // fixes MIME type error
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

// jwt user info
app.use((req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.locals.user = null;
        return next();
      }
      console.log(user);
      req.user = user;
      res.locals.user = user;
      next();
    });
  } else {
    res.locals.user = null;
    next();
  }
});

// Routes, if user is logged in, make home page dashboard - doesn't work
app.get("/", (req, res) => {
  if (req.session.userID) {
    res.render("dashboard");
  } else {
    res.sendFile("index.html");
  }
});

app.use("/", userRoutes);
app.use("/", cardRoutes);
app.use("/", collectionRoutes);
app.use("/", wishlistRoutes);
app.use("/", messageRoutes);

app.get("/profile", (req, res) => {
  res.render("profile");
});

// Listen
app.listen(process.env.SERVER_PORT || 3000, () =>
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
);
