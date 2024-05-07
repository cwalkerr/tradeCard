const jwt = require("jsonwebtoken");
const axios = require("axios");
const API_ENDPOINT_REFRESH = "http://localhost:4000/auth/refresh";
/**
 * verifys if a user is logged in - added in necessary routes
 * @param {*} message
 * @returns
 */
exports.verifyLoggedIn = (message) => {
  return (req, res, next) => {
    const token = req.cookies.jwt;
    const refreshToken = req.cookies.refreshJwt;

    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.render("login", { error: message });
        }
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET,
        async (err, user) => {
          if (err) {
            return res.render("login", { error: message });
          }
          const accessToken = await axios.post(API_ENDPOINT_REFRESH, {
            refreshToken: refreshToken,
          });
          res.cookie("jwt", accessToken.data, {
            httpOnly: true,
            maxAge: 600000,
          });
          req.user = user;
          next();
        }
      );
      return;
    } else {
      res.render("login", { error: message });
    }
  };
};
