const crypto = require("crypto");
function CheckRazorpaySignature(
  orderId,
  razorpayPaymentId,
  secret,
  razorpayAutoSignature
) {
  let generated_signature = crypto
    .createHmac("sha256", secret)
    .update(orderId + "|" + razorpayPaymentId)
    .digest("hex");

  if (generated_signature === razorpayAutoSignature) {
    return true;
  }
  return false;
}

module.exports = { CheckRazorpaySignature };
