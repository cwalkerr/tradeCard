/**
 * verifys if a user is logged in - added in necessary routes
 * @param {*} message
 * @returns
 */
exports.verifyLoggedIn = (message) => {
  return (req, res, next) => {
    if (!req.session.userID) {
      req.flash("error", message);
      return res.redirect("/login");
    }
    next();
  };
};

/**
 * general catch all error handler
 * @param {*} url the url to redirect to
 * @returns
 */
exports.catchError = (url) => {
  return (err, req, res) => {
    req.flash(
      "error",
      err.response.data.error ||
        err.message ||
        "An unexpected error occurred. Please try again later"
    );
    return res.redirect(url);
  };
};
