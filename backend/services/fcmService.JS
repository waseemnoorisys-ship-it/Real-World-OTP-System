const admin = require("../config/firebase");

const sendPushNotification = async (fcmToken) => {
  // if (!fcmToken) return

  if (!fcmToken || fcmToken === "optional_firebase_token") {
    return;
  }

  await admin.messaging().send({
    token: fcmToken,
    notification: {
      title: "OTP Sent",
      body: "Your OTP has been sent successfully",
    },
  });
};

module.exports = sendPushNotification;
