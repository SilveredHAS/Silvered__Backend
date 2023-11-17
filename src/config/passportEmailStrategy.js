const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    "custom-local",
    new LocalStrategy(
      { usernameField: "emailOrMobile" },
      async (identifier, password, done) => {
        try {
          console.log("In Custom Local Strategy");
          const user = await User.findOne({
            $or: [
              { email: identifier }, // Check if input matches an email in the database
              { mobileNumber: identifier }, // Check if input matches a mobile number in the database
            ],
          });

          if (!user) {
            console.log("User not found");
            return done(null, false, {
              message:
                "The entered Email/Mobile do not exist. Please Sign up into Silvered",
            });
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            console.log("Invalid password");
            return done(null, false, {
              message: "Please enter correct Email/Mobile and Password",
            });
          }
          console.log("User Logged in Successfully!");
          return done(null, user, { message: "Login Successfull" });
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

  //   passport.serializeUser((user, done) => {
  //     console.log("In serialize user of local passport strategy");
  //     done(null, user.id);
  //   });

  //   passport.deserializeUser(async (id, done) => {
  //     try {
  //       const user = await User.findById(id);
  //       console.log("In deserialize user of local passport strategy");
  //       done(null, user);
  //     } catch (error) {
  //       done(error);
  //     }
  //   });
};
