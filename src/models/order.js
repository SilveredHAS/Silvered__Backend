const mongoose = require("mongoose");
const { cartSchema } = require("./cart");

const orderSchema = new mongoose.Schema(
  {
    products: [cartSchema],
    orderId: String,
    dateOfOrder: Date,
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
    shippingAddress: {
      type: Object,
    },
    status: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
