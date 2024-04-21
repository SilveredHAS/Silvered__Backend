const mongoose = require("mongoose");

const otpRegisterBrandsSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isOtpActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const OTPRegisterBrands = mongoose.model(
  "otpRegisterBrands",
  otpRegisterBrandsSchema
);

module.exports = OTPRegisterBrands;
