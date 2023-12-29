const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const OTPRegister = require("../models/otpRegister");

module.exports = (passport) => {
  passport.use(
    "otp",
    new LocalStrategy(
      {
        usernameField: "mobileNumber",
      },
      async (mobileNumber, otp, done) => {
        try {
          // Check if the OTP is valid (match it against the user's stored OTP)
          const otp_user = await OTPRegister.findOne({ mobileNumber });

          if (!otp_user) {
            console.log("User not found");
            return done(null, false, {
              message:
                "The entered Mobile do not exist. Please Sign up into Silvered",
            });
          } else if (otp_user.isOtpActive === false) {
            console.log("OTP Expired! Please generate new otp to continue");
            return done(null, false, {
              message: "OTP Expired! Please generate new otp to continue",
            });
          } else if (otp_user.otp !== otp) {
            return done(null, false, {
              message: "Incorrect OTP! Please enter correct OTP.",
            });
          }

          // If OTP is valid, proceed with authentication
          else if (otp_user.otp === otp) {
            const user = await User.findOne({ mobileNumber });
            return done(null, user, {
              message: "OTP Verified Successfully",
            });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("In serialize user of local passport strategy");
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    console.log("In deserialize user of local passport strategy");
    done(null, obj);
  });
};
