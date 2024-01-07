const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
  updateProductById,
  getProductById,
} = require("../controllers/productController");
const DecryptMiddleware = require("../middleware/decryptMiddlware");

router.post("/create-product", DecryptMiddleware, createProduct);
router.post("/get-products", DecryptMiddleware, getAllProductsByCategory);
router.delete("/delete-product/:id", deleteProductById);
router.put("/update-product/:id", DecryptMiddleware, updateProductById);
router.get("/get-product/:id", getProductById);

module.exports = router;
