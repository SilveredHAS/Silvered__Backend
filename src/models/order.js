const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    dateOfOrder: {
      type: Date,
      default: Date.now, // Default value is the current date and time
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    shipping_address: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    isCustomized: {
      type: Boolean,
      default: false,
      required: true,
    },
    // ... additional fields and schema properties as needed
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, orderSchema };
