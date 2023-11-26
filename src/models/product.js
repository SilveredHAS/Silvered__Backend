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
    category: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    pattern: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    fit: {
      type: String,
      required: true,
    },
    sleeve: {
      type: String,
      required: true,
    },
    gsm: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
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
