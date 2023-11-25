const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProductsByCategory,
} = require("../controllers/productController");

router.post("/create-product", createProduct);
router.get("/products", getAllProductsByCategory);

module.exports = router;
