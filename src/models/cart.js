const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartId: String,
    productId: String,
    size: String,
    quantity: Number,
    detailedQuantity: Object,
    logoName: String,
  },
  { timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);

module.exports = { Cart, cartSchema };
