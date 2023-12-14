const mongoose = require("mongoose");

const otpRegisterSchema = new mongoose.Schema(
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

const OTPRegister = mongoose.model("otpRegister", otpRegisterSchema);

module.exports = OTPRegister;
