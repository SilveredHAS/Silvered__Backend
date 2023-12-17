const passport = require("passport");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const OTPRegister = require("../models/otpRegister");
const request = require("request");
const { GenerateSixDigitOTP } = require("../utils/generateOtp");
const { SetOTPInactiveAfterFiveMinutes } = require("../utils/setOTPTimeout");

const addOrder = async (req, res) => {
  try {
    console.log("Inside add order route controller");
    const { mobileNumber, orderItem } = req.body;
    console.log("Req body is ", req.body);
    const user = await User.findOne({ mobileNumber });
    const userId = user._id;
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Order Item is ", orderItem);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { orderHistory: orderItem } },
      { new: true } // To return the updated user document
    );
    if (updatedUser) {
      console.log(
        "Order Item added successfully and Updated user:",
        updatedUser
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Success",
      });
    }
  } catch (error) {
    console.log("Add Order Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Add Order failed" });
  }
};

const addWishlist = async (req, res) => {
  try {
    console.log("Inside add to wishlist route controller");
    const { mobileNumber, productId } = req.body;
    console.log("Req body is ", req.body);
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Product Id is ", productId);
    const userId = user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { wishlist: productId } },
      { new: true } // To return the updated user document
    );
    if (updatedUser) {
      console.log(
        "Wishlist Item added successfully and Updated user:",
        updatedUser
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Success",
      });
    }
  } catch (error) {
    console.log("Add Wishlist Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Add Wishlist failed" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    console.log("Inside get order history route controller");
    const { mobileNumber } = req.query;
    console.log("Req body is ", req.query);
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Order History is ", user.orderHistory);
    return res.status(200).json({
      isSuccess: true,
      message: "Success",
      orderHistory: user.orderHistory,
    });
  } catch (error) {
    console.log("Get Order History Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Get Order History failed" });
  }
};

const getWishList = async (req, res) => {
  try {
    console.log("Inside get order history route controller");
    const { mobileNumber } = req.query;
    console.log("Req body is ", req.query);
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Get Wishlist is ", user.wishlist);
    return res.status(200).json({
      isSuccess: true,
      message: "Success",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.log("Get Wishlist Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Get Wishlist failed" });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    console.log("Inside delete order history route controller");
    const { mobileNumber, productId } = req.body;
    console.log("Req body is ", req.query);
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    const userId = user._id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    if (updatedUser) {
      console.log(
        "Wishlist item deleted successfully and Updated user:",
        updatedUser
      );
      return res.status(200).json({
        isSuccess: true,
        message: "Success",
      });
    }
  } catch (error) {
    console.log("Deleting a Wishlist Item Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Deleting a Wishlist Item Failed" });
  }
};

module.exports = {
  addOrder,
  getOrderHistory,
  addWishlist,
  getWishList,
  deleteWishlist,
};
