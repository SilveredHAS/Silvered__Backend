const express = require("express");
const router = express.Router();
const {
  getOrderHistory,
  getWishList,
  addOrder,
  addWishlist,
  deleteWishlist,
} = require("../controllers/orderController");

router.get("/order-history", getOrderHistory);
router.get("/get-wishlist", getWishList);
router.post("/add-to-orders", addOrder);
router.post("/add-to-wishlist", addWishlist);
router.delete("/delete-wishlist", deleteWishlist);

module.exports = router;
