const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  getOrderHistory,
  getWishList,
  addOrder,
  addWishlist,
  deleteWishlist,
  submitCustomize,
} = require("../controllers/orderController");

router.get("/order-history", getOrderHistory);
router.get("/get-wishlist", getWishList);
router.post("/add-to-orders", addOrder);
router.post("/add-to-wishlist", addWishlist);
router.delete("/delete-wishlist", deleteWishlist);
router.post("/submit-customize", upload.array("image"), submitCustomize);

module.exports = router;
