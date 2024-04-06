const express = require("express");
const app = express();
const authRoutes = require("./api/routes/api_authRoutes");
const cardRoutes = require("./api/routes/api_cardRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/api", cardRoutes);

const PORT = process.env.API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});
