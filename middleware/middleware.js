const jwt = require("jsonwebtoken");
/**
 * verifys if a user is logged in - added in necessary routes
 * @param {*} message
 * @returns
 */
exports.verifyLoggedIn = (message) => {
  return (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.render("login", { error: message });
        }
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      return res.render("login", { error: message });
    }
  };
};

/**
 * general catch all error handler
 * @param {*} url the url to redirect to
 * @returns
 */
exports.catchError = (url) => {
  return (err, req, res) => {
    console.log(err);
    return res.redirect(url);
  };
};
