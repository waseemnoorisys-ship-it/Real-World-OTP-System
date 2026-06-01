const User = require("../models/User")

exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId)

  res.json({
    success: true,
    message: "Hello World",
    user
  })
}