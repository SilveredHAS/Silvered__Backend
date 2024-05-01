const mongoose = require("mongoose");

const brandUserSchema = new mongoose.Schema({
  brandName: { type: String, required: true, unique: true },
  contactPersonFullName: { type: String, required: true },
  contactPersonMobileNumber: { type: String, required: true },
  officeContactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gstNumber: { type: String, required: true },
  buildingNo: { type: String, required: true },
  area: { type: String, required: true },
  town: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  brandLogo: { type: String, required: true },
  shopImages: [String],
  otp: { type: String },
  isOtpActive: { type: Boolean },
});

const BrandUser = mongoose.model("BrandUser", brandUserSchema);

module.exports = BrandUser;
