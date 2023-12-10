const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    "custom-local",
    new LocalStrategy(
      { usernameField: "mobileNumber" },
      async (identifier, password, done) => {
        try {
          console.log("In Custom Local Strategy");
          console.log("Identifier is ", identifier);
          const user = await User.findOne({ mobileNumber: identifier });

          if (!user) {
            console.log("User not found");
            return done(null, false, {
              message:
                "The entered Mobile do not exist. Please Sign up into Silvered",
            });
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            console.log("Invalid password");
            return done(null, false, {
              message: "Please enter correct mobile number and Password",
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
