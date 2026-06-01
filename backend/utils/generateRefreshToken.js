const jwt = require("jsonwebtoken");
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId },
    process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = generateRefreshToken;