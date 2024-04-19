const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const flash = require("connect-flash");
const path = require("path");
const methodOverride = require("method-override");

// Route imports
const userRoutes = require("./web/routes/app_userRoutes");
const cardRoutes = require("./web/routes/app_cardRoutes");
const collectionRoutes = require("./web/routes/app_collectionRoutes");
const wishlistRoutes = require("./web/routes/app_wishlistRoutes");
// Constant for hour
const hour = 1000 * 60 * 60;

// initialize express app
const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "web/views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "web", "public")));
app.use(
  "/bootstrap",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist"))
); // fixes MIME type error
app.use(express.json());
app.use(flash());
app.use(cookieParser());
app.use(methodOverride("_method"));

// Session middleware
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
  res.sendFile("index.html");
});

app.use("/", userRoutes);
app.use("/", cardRoutes);
app.use("/", collectionRoutes);
app.use("/", wishlistRoutes);

// Listen
app.listen(process.env.SERVER_PORT || 3000, () =>
  console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`)
);
