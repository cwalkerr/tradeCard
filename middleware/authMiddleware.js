const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  console.log("authenticating token");
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided. Please log in again.",
    });
  }
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: "Access denied. Invalid or expired token. Please log in again.",
      });
    }
    req.user = user;
    next();
  });
};

exports.verifyUserId = (req, res, next) => {
  if (Number(req.params.userId) !== req.user.id) {
    return res.status(403).json({ error: "Access denied." });
  }

  next();
};
