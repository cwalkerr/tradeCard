const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const flash = require("connect-flash");

// Routes
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const dashboardRoute = require("./routes/dashboard");

const hour = 1000 * 60 * 60; // 1 hour

const app = express();
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
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
  res.render("index");
});

app.use("/dashboard", dashboardRoute);
app.use("/login", loginRoute);
app.use("/signup", signupRoute);

// Listen
app.listen(process.env.PORT || 3000, () =>
  console.log("Server is running on port 3000")
);
