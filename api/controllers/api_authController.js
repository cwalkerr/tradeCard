const { User } = require("../models/userModel.js");
const { Wishlist } = require("../models/wishlistModel.js");
const { RefreshToken } = require("../models/modelAssosiations.js");
const { Sequelize, Op } = require("sequelize");
const jwt = require("jsonwebtoken");

// remove expired refresh tokens every hour
setInterval(async () => {
  const now = new Date();
  await RefreshToken.destroy({ where: { expires_at: { [Op.lt]: now } } });
}, 60 * 60 * 1000);

/**
 * API controller to register a new user
 */
exports.signup = async (req, res) => {
  const { email, username, password, passwordCheck } = req.body;

  // pre-validation checks
  if (!email || !username || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  if (password !== passwordCheck) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  // check if user already exists
  let user = await User.findAll({
    where: {
      email: email,
    },
  });

  // if user found return error
  if (user.length > 0) {
    return res
      .status(400)
      .json({ error: "This email is already in use, please login" });
  }

  // create user
  try {
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
      .status(200)
      .json({ success: "You are now registered and can log in" });
  } catch (err) {
    if (err instanceof Sequelize.ValidationError) {
      const errorMessage = err.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    } else {
      return res
        .status(500)
        .json({ error: err.message || "An error occurred" });
    }
  }
};

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
 * API controller to login a user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // pre-validation checks
  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    // find user by email
    let user = await User.findOne({
      where: {
        email: email,
      },
    }); // email is unique

    // if user not found return error
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
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
      expiresAt.setDate(expiresAt.getDate() + 1);

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
      return res.status(400).json({ error: "Incorrect password" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshJwt;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Access denied. No refresh token provided." });
  }

  try {
    const tokenData = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [{ model: User, attributes: ["username"] }],
    });

    if (!tokenData || tokenData.expiresAt < new Date()) {
      return res
        .status(401)
        .json({ error: "Access denied. Invalid or expired refresh token." });
    }

    const user = { id: tokenData.user_id, username: tokenData.User.username };
    const accessToken = createToken(user);
    // res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 600000 });

    res.json({ accessToken });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An unexpected error occurred. Please try again later." });
  }
};
