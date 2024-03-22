// file for utility functions
const bcrypt = require("bcrypt");

// function to validate email
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(String(email).toLowerCase())) return false;
  if (email.length > 124) return false;

  return true;
};

// function to hash password
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 13);
  return hashedPassword;
};

module.exports = {
  validateEmail,
  hashPassword,
};
