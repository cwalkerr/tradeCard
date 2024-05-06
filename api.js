const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./api/routes/api_authRoutes");
const cardRoutes = require("./api/routes/api_cardRoutes");
const collectionRoutes = require("./api/routes/api_collectionRoutes");
const wishlistRoutes = require("./api/routes/api_wishlistRoutes");
const filterRoutes = require("./api/routes/api_filterRoutes");
const messageRoutes = require("./api/routes/api_messageRoutes");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again after 15 minutes",
});

app.use(limiter);

app.use("/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", collectionRoutes);
app.use("/api", wishlistRoutes);
app.use("/api", filterRoutes);
app.use("/api", messageRoutes);

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
