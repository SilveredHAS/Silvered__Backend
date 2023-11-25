const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    details: {
      material: {
        type: String,
        required: true,
      },
      pattern: {
        type: String,
        required: true,
      },
      fit: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      sleeve: {
        type: String,
        required: true,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    inventory: {
      quantity: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ["in_stock", "out_of_stock"],
        default: "in_stock",
      },
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    discounts: [
      {
        discountType: {
          type: String,
          enum: ["percentage", "fixed_amount"],
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
      },
    ],
    // ... additional fields and schema properties as needed
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
