const mongoose = require("mongoose");

const brandUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  brandName: { type: String, required: true },
  brandLogo: { type: String, required: true },
  gstNumber: { type: String, required: true },
  buildingNo: { type: String, required: true },
  area: { type: String, required: true },
  town: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  otp: { type: String },
  isOtpActive: { type: Boolean },
});

const BrandUser = mongoose.model("BrandUser", brandUserSchema);

module.exports = BrandUser;
