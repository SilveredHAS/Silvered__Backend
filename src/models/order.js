const mongoose = require("mongoose");
const { cartSchema } = require("./cart");

const orderSchema = new mongoose.Schema(
  {
    products: [cartSchema],
    orderId: String,
    dateOfOrder: {
      type: Date,
      default: Date.now, // Default value is the current date and time
      required: true,
    },
    totalAmount: Number,
    paymentId: String,
    receiptId: String,
    razorpayOrderId: String,
    razorpayOrderIdStatus: String,
    razorpaySignature: String,
    isPaymentSuccess: Boolean,
    isPaymentVerified: Boolean,
    isPaymentValid: Boolean,
    totalQuantity: Number,
    shipping_address: String,
    status: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
