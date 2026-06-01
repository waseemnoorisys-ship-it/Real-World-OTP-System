const jwt = require("jsonwebtoken")

const generateToken = (userId) => {
  // JWT works like temporary session identity
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })
}

module.exports = generateToken