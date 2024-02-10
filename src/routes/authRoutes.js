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
  loginAuthenticationAffiliate,
  registerAuthenticationAffiliate,
  verifyOtpAffiliate,
  checkValidMobileNumberAffiliate,
  updatePasswordAffiliate,
  checkCurrentUserAffiliate,
  getAffiliateEarnings,
  getIsCouponCodeValid,
} = require("../controllers/authController");
const DecryptMiddleware = require("../middleware/decryptMiddlware");

router.post("/auth/login", DecryptMiddleware, loginAuthentication);
router.post(
  "/auth/login-affiliate",
  DecryptMiddleware,
  loginAuthenticationAffiliate
);
router.post("/auth/register", DecryptMiddleware, registerAuthentication);
router.post(
  "/auth/register-affiliate",
  DecryptMiddleware,
  registerAuthenticationAffiliate
);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/verify-otp-affiliate", verifyOtpAffiliate);
router.get("/logout", logoutUser);
router.get("/getAffiliateEarnings", getAffiliateEarnings);
router.get("/getIsCouponCodeValid/:couponCode", getIsCouponCodeValid);
router.post("/check-valid-mobile", checkValidMobileNumber);
router.post("/check-valid-mobile-affiliate", checkValidMobileNumberAffiliate);
router.post("/send-otp", sendOTP);
router.post("/update-password", updatePassword);
router.post("/update-password-affiliate", updatePasswordAffiliate);
router.get("/curr-user", checkCurrentUser);
router.get("/curr-user-affiliate", checkCurrentUserAffiliate);

module.exports = router;
