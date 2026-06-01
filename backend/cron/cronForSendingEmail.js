// const cron = require("node-cron");
// const User = require("../models/User");
// const sendOtpMail = require("../services/mailService");
// const logger = require("../utils/logger");

// cron.schedule("*/1 * * * *", async () => {
//   console.log("Running cron job to send welcome emails...");
//   io.emit("welcome-popup", {
//     message: `Welcome ${user.email} 🚀`,
//   });

//   //find user who never received welcome email
//   const users = await User.find({
//     welcomeEmailSent: false,
//   });

//   for (let user of users) {
//     await sendOtpMail(
//       user.email,
//       "Welcome to our OTP system! We're glad to have you on board.",
//     );

//     //mark welcome email sent
//     user.welcomeEmailSent = true;

//     await user.save();
//     logger.info(`welcome email sent to ${user.email}`);
//   }
// });

const cron = require("node-cron");

const User = require("../models/User");

const sendWelcomeMail = require("../services/sendWelcomeMail")

const logger = require("../utils/logger");

// IMPORT SOCKET.IO INSTANCE
// const io = require("../server");
const { getIO } = require("../socket");

cron.schedule("*/10 * * * *", async () => {
  console.log("Running welcome email cron");

  const users = await User.find({
    welcomeEmailSent: false,
  });

  for (const user of users) {
    // SEND EMAIL
    await sendWelcomeMail(user.email);

    const io = getIO(); // Get Socket.IO instance
    // REALTIME POPUP EVENT
    io.emit("welcome-popup", {
      message: `Welcome ${user.email} 🚀`,
    });

    // MARK AS SENT
    user.welcomeEmailSent = true;

    await user.save();

    logger.info(`Welcome email sent to ${user.email}`);
  }
});
