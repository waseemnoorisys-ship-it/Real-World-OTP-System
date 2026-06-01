const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,

    googleId: String,

    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    password:{
      type:String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    welcomeEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
