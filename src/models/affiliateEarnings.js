const mongoose = require("mongoose");

const affiliateEarningsSchema = new mongoose.Schema({
  orderDate: { type: String, required: true },
  amount: { type: Number, required: true },
});

const AffiliateEarnings = mongoose.model(
  "AffiliateEarnings",
  affiliateEarningsSchema
);

module.exports = { AffiliateEarnings, affiliateEarningsSchema };
