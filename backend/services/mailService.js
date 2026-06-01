const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Your OTP is: ${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
  // console.log(process.env.EMAIL_USER);
  // console.log(process.env.EMAIL_PASS);
};

module.exports = sendOtpMail;
