const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./api/routes/api_authRoutes");
const cardRoutes = require("./api/routes/api_cardRoutes");
const collectionRoutes = require("./api/routes/api_collectionRoutes");
const wishlistRoutes = require("./api/routes/api_wishlistRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api", cardRoutes);
app.use("/api", collectionRoutes);
app.use("/api", wishlistRoutes);

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
