const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
} = require("../controllers/productController");

router.post("/create-product", createProduct);
router.get("/products", getAllProductsByCategory);
router.delete("/delete-product/:id", deleteProductById);

module.exports = router;
