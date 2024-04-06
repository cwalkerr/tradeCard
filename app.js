const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const flash = require("connect-flash");
const path = require("path");

// Routes
const userRoutes = require("./web/routes/app_userRoutes");
const cardRoutes = require("./web/routes/app_cardRoutes");

const hour = 1000 * 60 * 60; // 1 hour

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "web/views"));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "web", "public")));
app.use("/node_modules", express.static(__dirname + "/node_modules")); // prob not needed anymore
app.use(express.json());
app.use(flash());
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: hour },
    resave: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "web/public", "index.html"));
});

// User routes for login and signup
app.use("/", userRoutes);
app.use("/", cardRoutes);

// Listen
app.listen(process.env.SERVER_PORT || 3000, () =>
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
);
