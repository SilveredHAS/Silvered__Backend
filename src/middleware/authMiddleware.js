// authMiddleware.js
const authenticationMiddleware = (req, res, next) => {
  // Check if the user is authenticated, you can implement your own logic here
  const isAuthenticated =
    req.session && req.session.user && req.session.user.isAuthenticated;
  console.log(
    "Inside auth middleware and status is isAuthenticated is ",
    isAuthenticated
  );
  if (isAuthenticated) {
    next();
  } else {
    console.log("Inside else");
    const redirectURL = `/login`;
    console.log(redirectURL);

    res.status(303).json({ redirectURL: redirectURL });
  }
};

module.exports = { authenticationMiddleware };
