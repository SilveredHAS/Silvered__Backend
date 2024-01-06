const mongoose = require("mongoose");
const { orderSchema } = require("../models/order");
const { cartSchema } = require("./cart");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  isOtpActive: { type: Boolean },
  orderHistory: [orderSchema],
  wishlist: [String],
  shippingAddresses: [String],
  cart: [cartSchema],
  customization: String,
  // Add other user properties as needed
});

const User = mongoose.model("User", userSchema);

module.exports = User;
