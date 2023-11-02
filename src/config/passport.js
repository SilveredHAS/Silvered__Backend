const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  // Replace these with your Google OAuth 2.0 credentials
  const googleClientId = "YOUR_CLIENT_ID";
  const googleClientSecret = "YOUR_CLIENT_SECRET";

  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "750398454345-8h9gmqe9d3usk892jspaanv7ldng43a7.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:5000/auth/google/callback",
      },
      (token, tokenSecret, profile, done) => {
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};
