const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    productId: String,
    quantity: Number,
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);

module.exports = { Cart, cartSchema };
