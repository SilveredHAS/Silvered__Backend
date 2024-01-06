const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});
const {
  getOrderHistory,
  getWishList,
  addOrder,
  addToCart,
  addWishlist,
  deleteWishlist,
  submitCustomize,
  getCartItems,
  deleteCartItem,
  updateCart,
  getCustomization,
} = require("../controllers/orderController");
const { authenticationMiddleware } = require("../middleware/authMiddleware");

router.get("/order-history", getOrderHistory);
router.get("/get-wishlist", getWishList);
router.get("/get-customization", getCustomization);
router.post("/cart-items", authenticationMiddleware, getCartItems);
router.delete("/delete-cart-items/:id", deleteCartItem);
router.post("/add-to-orders", addOrder);
router.put("/update-cart/:id", updateCart);
router.post("/add-to-cart", addToCart);
router.post("/add-to-wishlist", addWishlist);
router.delete("/delete-wishlist", deleteWishlist);
router.post("/submit-customize", upload.array("image"), submitCustomize);

module.exports = router;
