const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
  updateProductById,
} = require("../controllers/productController");

router.post("/create-product", createProduct);
router.get("/products", getAllProductsByCategory);
router.delete("/delete-product/:id", deleteProductById);
router.put("/update-product/:id", updateProductById);

module.exports = router;
