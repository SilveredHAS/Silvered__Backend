const mongoose = require("mongoose");
const { affiliateEarningsSchema } = require("./affiliateEarnings");

const affiliateUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  affiliateCode: { type: String, required: true },
  affiliateEarnings: [affiliateEarningsSchema],
  otp: { type: String },
  isOtpActive: { type: Boolean },
});

const AffiliateUser = mongoose.model("AffiliateUser", affiliateUserSchema);

module.exports = AffiliateUser;
