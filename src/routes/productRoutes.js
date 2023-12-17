const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProductsByCategory,
  deleteProductById,
  updateProductById,
  getProductById,
} = require("../controllers/productController");

router.post("/create-product", createProduct);
router.post("/get-products", getAllProductsByCategory);
router.delete("/delete-product/:id", deleteProductById);
router.put("/update-product/:id", updateProductById);
router.get("/get-product/:id", getProductById);

module.exports = router;
