/**
 * verifys if a user is logged in - added in necessary routes
 * @param {*} message
 * @returns
 */
const verifyLoggedIn = (message) => {
  return (req, res, next) => {
    if (!req.session.userID) {
      req.flash("error", message);
      return res.redirect("/login");
    }
    next();
  };
};

module.exports = verifyLoggedIn;
