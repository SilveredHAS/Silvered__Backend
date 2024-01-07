const express = require("express");
const router = express.Router();
const {
  loginAuthentication,
  registerAuthentication,
  verifyOtp,
  logoutUser,
  checkCurrentUser,
  sendOTP,
  checkValidMobileNumber,
  updatePassword,
} = require("../controllers/authController");
const DecryptMiddleware = require("../middleware/decryptMiddlware");

router.post("/auth/login", DecryptMiddleware, loginAuthentication);
router.post("/auth/register", DecryptMiddleware, registerAuthentication);
router.post("/auth/verify-otp", verifyOtp);
router.get("/logout", logoutUser);
router.post("/check-valid-mobile", checkValidMobileNumber);
router.post("/send-otp", sendOTP);
router.post("/update-password", updatePassword);
router.get("/curr-user", checkCurrentUser);

module.exports = router;
