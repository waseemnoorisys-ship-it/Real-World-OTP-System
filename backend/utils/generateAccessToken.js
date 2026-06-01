const jwt = require('jsonwebtoken');
const generateAccessToken = (userId) => {
  return jwt.sign({ userId },
    process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};
module.exports = generateAccessToken;