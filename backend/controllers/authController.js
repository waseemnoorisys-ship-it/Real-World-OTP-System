const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");
const logger = require("../utils/logger");
const generateOTP = require("../utils/generateOTP");
//commented because of phase 2
// const generateToken = require("../utils/generateToken")
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
//

const sendOtpMail = require("../services/mailService");
const sendPushNotification = require("../services/fcmService");

exports.sendOtp = async (req, res) => {
  try {
    const { email, fcmToken } = req.body;

    const otp = generateOTP();

    // Hash OTP so if DB leaks, attackers can't login
    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOtpMail(email, otp);

    await sendPushNotification(fcmToken);

    /*
    // Twilio SMS example
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_NUMBER,
      to: phone
    })
    */

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
    logger.info(`OTP sent to ${email}`)
    logger.error()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//OLD VERSION OF CODE WITHOUT REFRESH AND ACCESS TOKEN
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const otpDoc = await Otp.findOne({ email });

//     if (!otpDoc) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     if (new Date() > otpDoc.expiresAt) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     const isMatch = await bcrypt.compare(otp, otpDoc.otp);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     let user = await User.findOne({ email });

//     // Auto-create account on first successful verification
//     if (!user) {
//       user = await User.create({
//         email,
//         isVerified: true,
//       });
//     }
//     //old code
//     // const token = generateToken(user._id)
//     // Generate short-lived access token
//     const accessToken = generateAccessToken(user._id);

//     // Generate long-lived refresh token
//     const refreshToken = generateRefreshToken(user._id)

//     // Save refresh token in DB for future session validation
//     user.refreshToken = refreshToken
//     await user.save()

//     await Otp.deleteMany({ email });

//     res.json({
//       success: true,
//       token,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

//NEW VERSION OF CODE WITH REFRESH AND ACCESS TOKEN
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpDoc = await Otp.findOne({ email });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > otpDoc.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({ email });

    // Auto-create account on first successful verification
    if (!user) {
      user = await User.create({
        email,
        isVerified: true,
        welcomeEmailSent: false
      });
    }

    // Generate short-lived access token
    const accessToken = generateAccessToken(user._id);

    // Generate long-lived refresh token
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in DB for future session validation
    user.refreshToken = refreshToken;
    await user.save();

    // Remove used OTPs so they cannot be reused
    await Otp.deleteMany({ email });

    // Store refresh token securely in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//controller function to handle refresh token requests and issue new access tokens
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const accessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Refresh token expired",
    });
  }
};

//logout controller to clear refresh token from DB and cookies
exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  const user = await User.findOne({ refreshToken: token });

  if (user) {
    (user, (refreshToken = null));
    await user.save();
  }
  res.clearCookie("refreshToken");
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //create random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //hash token before saving for security
    const hashedToken = await crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    //reset link valid for 15 minutes
    user.resetPasswordExpires = Date.now() + 1560 * 1000;

    await user.save();
    //frontend reset url
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    //send email
    await sendOtpMail(email, `reset your password using this link:${resetUrl}`);

    res.json({
      success: true,
      message: "password rset link sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    //hash URL token to compare with DB
    const hashedToken = crypto.createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    //hash new password before saving for security
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    //remove reset token after use
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({
      success: true,
      message: "Password reset successful",
    }); 
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
