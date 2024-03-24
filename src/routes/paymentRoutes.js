const express = require("express");
const router = express.Router();
const {
  getOrderId,
  verifyPayment,
  affiliatePayCommission,
} = require("../controllers/paymentController");
const DecryptMiddleware = require("../middleware/decryptMiddlware");

router.post("/get-order-id", getOrderId);
router.post("/verify-payment", verifyPayment);
router.get("/affiliate-pay-commission", affiliatePayCommission);

module.exports = router;
