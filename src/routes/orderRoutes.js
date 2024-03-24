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
  addToCart,
  addWishlist,
  deleteWishlist,
  submitCustomize,
  getCartItems,
  deleteCartItem,
  updateCart,
  getCustomization,
  getSavedAddress,
} = require("../controllers/orderController");
const DecryptMiddleware = require("../middleware/decryptMiddlware");

router.get("/order-history", getOrderHistory);
router.get("/get-wishlist", getWishList);
router.get("/get-customization", getCustomization);
router.get("/get-saved-address", getSavedAddress);
router.get("/cart-items", getCartItems);
router.delete("/delete-cart-items/:id", deleteCartItem);
router.put("/update-cart/:id", updateCart);
router.post("/add-to-cart", DecryptMiddleware, addToCart);
router.post("/add-to-wishlist", DecryptMiddleware, addWishlist);
router.delete("/delete-wishlist", deleteWishlist);
router.post("/submit-customize", upload.array("image"), submitCustomize);

module.exports = router;
