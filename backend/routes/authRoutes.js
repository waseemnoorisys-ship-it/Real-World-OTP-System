const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const refreshToken = require("../controllers/authController").refreshToken;
const logout = require("../controllers/authController").logout;
const {
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Prevent OTP spam attacks
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests",
  },
});

router.post("/send-otp", otpLimiter, sendOtp);

router.post("/verify-otp", verifyOtp);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.post("/refresh-token", refreshToken);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  //function to handle successful authentication and redirect with token
  async (req, res) => {
    // const token = req.user.token
    const { accessToken, refreshToken } = req.user;
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`,
    );
  },
);

router.post("/logout", logout);

router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);

module.exports = router;
