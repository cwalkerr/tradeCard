// file for utility functions
const bcrypt = require("bcrypt");

/**
 * checks if email is valid format
 * @param {*} email
 * @returns true if email is valid, false if not
 */
const validateEmail = (email) => {
  // regex for email validation
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(String(email).toLowerCase())) return false;
  if (email.length > 124) return false;

  return true;
};

/**
 * hashes password
 * @param {*} password
 * @returns hashed password
 */
const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 13);
    return hashedPassword;
  } catch {
    res.status(500).send("Something went wrong hashing the password");
  }
};

/**
 * checks password at login
 * @param {*} password
 * @param {*} hashedPassword
 * @returns true if password matches, false if not
 */
const checkPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);

    if (match) return true;
    return false;
  } catch (err) {
    console.log("Error checking password", err);
  }
};

// export functions
module.exports = {
  validateEmail,
  hashPassword,
  checkPassword,
};
