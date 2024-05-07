const { Sequelize } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof Sequelize.ValidationError) {
    const errorMessage = err.errors.map((e) => e.message).join(", ");
    return res.status(400).json({ error: errorMessage });
  }
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "An error occurred";
  return res.status(err.statusCode).json({ error: err.message });
};

module.exports = errorHandler;
