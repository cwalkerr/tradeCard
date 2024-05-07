const { User } = require("../models/userModel.js");
const { Wishlist } = require("../models/wishlistModel.js");
const { RefreshToken } = require("../models/modelAssosiations.js");
const { Op } = require("sequelize");
const { tryCatch } = require("../../utility/tryCatch.js");
const apiError = require("../../utility/customError.js");
const jwt = require("jsonwebtoken");

// remove expired refresh tokens every hour
setInterval(async () => {
  const now = new Date();
  await RefreshToken.destroy({ where: { expires_at: { [Op.lt]: now } } });
}, 60 * 60 * 1000);

// create tokens on login
const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

/**
 * API controller to register a new user
 */
exports.signup = tryCatch(async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  if (!email || !username || !password) {
    throw new apiError("Please enter all fields", 400);
  }
  if (password !== passwordCheck) {
    throw new apiError("Passwords do not match", 400);
  }

  // check if user already exists
  let user = await User.findAll({
    where: {
      email: email,
    },
  });

  // if user found return error
  if (user.length > 0 || !user) {
    throw new apiError("This email already exists, please login", 409);
  }

  // create user
  user = await User.create({
    email: email,
    username: username,
    password: password,
  });

  // when user is created, create their wishlist
  await Wishlist.create({
    user_id: user.user_id,
  });

  return res
    .status(201)
    .json({ success: "You are now registered and can log in" });
});

/**
 * API controller to login a user
 */
exports.login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  // pre-validation checks
  if (!email || !password) {
    throw new apiError("Please enter all fields", 400);
  }
  // find user by email
  let user = await User.findOne({
    where: {
      email: email,
    },
  }); // email is unique

  // if user not found return error
  if (!user) {
    throw new apiError("Email not found", 404);
  }
  // check if password matches
  if (await user.checkPassword(password)) {
    const userData = {
      id: user.dataValues.user_id,
      username: user.dataValues.username,
    };

    // create tokens
    const accessToken = createToken(userData);
    const refreshToken = generateRefreshToken(userData);

    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 1 day after current time

    // save refresh token in database
    await RefreshToken.create({
      token: refreshToken,
      user_id: userData.id,
      expires_at: expiresAt,
    });

    return res.status(200).json({
      success: "Login successful",
      accessToken,
      refreshToken,
    });
  } else {
    throw new apiError("Incorrect Password", 401);
  }
});

exports.refresh = tryCatch(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    throw new apiError("Access denied. No refresh token provided.", 401);
  }

  const tokenData = await RefreshToken.findOne({
    where: { token: refreshToken },
    include: [{ model: User, attributes: ["username"] }],
  });

  if (!tokenData || tokenData.expiresAt < new Date()) {
    throw new apiError("Access denied. Invalid or expired refresh token.", 403);
  }

  const user = { id: tokenData.user_id, username: tokenData.User.username };
  const accessToken = createToken(user);
  res.json({ accessToken });
});
