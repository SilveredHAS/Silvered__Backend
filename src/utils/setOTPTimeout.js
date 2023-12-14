const OTPRegister = require("../models/otpRegister");

const SetOTPInactiveAfterFiveMinutes = (
  otp,
  mobileNumber,
  timeOut = 5 * 60 * 1000
) => {
  setTimeout(async () => {
    try {
      console.log(
        `Inside SetOTPInactiveAfterFiveMinutes function and otp is ${otp} and mobile Number is ${mobileNumber} and timeOut is ${timeOut}`
      );
      const user = await OTPRegister.findOne({ mobileNumber });
      console.log("User is ", user);
      if (!user) {
        console.error("User not found");
        return;
      }

      // Set OTP status to inactive
      if (user.otp === otp) {
        user.isOtpActive = false;
        await user.save();
      }
      console.log("OTP status set to inactive after 5 minutes");
    } catch (err) {
      console.error("Error setting OTP status to inactive:", err);
    }
  }, timeOut); // 5 minutes in milliseconds
};

module.exports = { SetOTPInactiveAfterFiveMinutes };
