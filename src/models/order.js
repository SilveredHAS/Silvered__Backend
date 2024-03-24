const mongoose = require("mongoose");
const { cartSchema } = require("./cart");

const orderSchema = new mongoose.Schema(
  {
    customerId: String,
    orderId: String,
    orderType: String,
    dateOfOrder: Date,
    totalAmount: Number,
    paymentId: String,
    receiptId: String,
    razorpayOrderId: String,
    razorpayOrderIdStatus: String,
    products: [cartSchema],
    razorpaySignature: String,
    isPaymentSuccess: Boolean,
    isPaymentVerified: Boolean,
    isPaymentValid: Boolean,
    totalQuantity: Number,
    isCouponCodeValid: Boolean,
    couponCode: String,
    couponCodeDiscount: Number,
    shippingAddress: {
      type: Object,
    },
    status: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
