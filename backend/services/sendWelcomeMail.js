const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeMail = async (email) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Welcome To Our Platform 🚀",

    html: `
    
      <div style="
        max-width:600px;
        margin:auto;
        padding:20px;
        font-family:Arial;
        border:1px solid #ddd;
        border-radius:10px;
      ">

        <div style="text-align:center;">
          <h1 style="color:#333;">
            🚀 Welcome To Our Platform
          </h1>
        </div>

        <p style="
          font-size:16px;
          color:#555;
          line-height:1.6;
        ">
          We are excited to have you onboard.
        </p>

        <p style="
          font-size:16px;
          color:#555;
          line-height:1.6;
        ">
          Your account has been successfully created.
        </p>

        <div style="
          text-align:center;
          margin-top:30px;
        ">
          <a
            href="http://localhost:5173/dashboard"
            style="
              background:black;
              color:white;
              padding:12px 20px;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Go To Dashboard
          </a>
        </div>

        <p style="
          margin-top:40px;
          text-align:center;
          color:gray;
        ">
          Thank you for joining us ❤️
        </p>

      </div>
    `,
  });
};

module.exports = sendWelcomeMail;
