const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const OTPRegister = require("../models/otpRegister");
const AffiliateUser = require("../models/affiliateUser");

module.exports = (passport) => {
  passport.use(
    "custom-otp-affiliate",
    new LocalStrategy(
      {
        // or whatever you want to use
        usernameField: "mobileNumber", // define the parameter in req.body that passport can use as username and password
        passwordField: "otp",
      },
      async (username, password, done) => {
        try {
          console.log("In OTP Local Strategy");
          console.log("Identifier is ", username);
          console.log("OTP is ", password);
          // Check if the OTP is valid (match it against the user's stored OTP)
          const otp_user = await OTPRegister.findOne({
            mobileNumber: username,
          });

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
          } else if (otp_user.otp !== password) {
            return done(null, false, {
              message: "Incorrect OTP! Please enter correct OTP.",
            });
          }

          // If OTP is valid, proceed with authentication
          else if (otp_user.otp === password) {
            const user = await AffiliateUser.findOne({
              mobileNumber: username,
            });
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
