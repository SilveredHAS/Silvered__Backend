const passport = require("passport");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const OTPRegister = require("../models/otpRegister");
const request = require("request");
const { GenerateSixDigitOTP } = require("../utils/generateOtp");
const { SetOTPInactiveAfterFiveMinutes } = require("../utils/setOTPTimeout");
const { sendMail } = require("../utils/sendMail");
const { generateReceiptId } = require("../utils/generateReceiptId");
const CryptoJS = require("crypto-js");

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
const addToCart = async (req, res) => {
  try {
    console.log("Inside add order route controller");
    const mobileNumber = req.session.user.mobileNumber;
    console.log(req.body);
    const { productId, selectedProductDetails, logoName, quantity } = req.body;
    const cartId = `${
      req.session.user.mobileNumber
    }-cart-${generateReceiptId()}`;
    console.log("Cart Id is ", cartId);
    const newItem = {
      cartId: cartId,
      productId: productId,
      size: selectedProductDetails.size,
      quantity: quantity,
      logoName: logoName,
    };
    console.log("Req body is ", req.body);
    const user = await User.findOne({ mobileNumber });

    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    user.cart = [...user.cart, newItem];
    await user.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Success",
      cartSize: user.cart.length,
    });
  } catch (error) {
    console.log("Add To Cart Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Add To Cart failed" });
  }
};

const addWishlist = async (req, res) => {
  try {
    console.log("Inside add to wishlist route controller");
    const { productId } = req.body;
    console.log("Req body is ", req.body);
    const user = await User.findOne({
      mobileNumber: req.session.user.mobileNumber,
    });
    // console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Product Id is ", productId);
    const userId = user._id;
    if (user && !user.wishlist.includes(productId)) {
      // If productId doesn't exist in wishlist, perform update
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { wishlist: productId } },
        { new: true }
      );
      if (updatedUser) {
        console.log(
          "Wishlist Item added successfully and Updated user:",
          updatedUser
        );
        return res.status(200).json({
          isSuccess: true,
          message: "Product Added to Wishlist Successfully!",
        });
      }
    } else {
      // If productId already exists in wishlist, return the user without updating
      const updatedUser = user;
      if (updatedUser) {
        console.log(
          "Wishlist Item added successfully and Updated user:",
          updatedUser
        );
        return res.status(200).json({
          isSuccess: true,
          message: "Product already exists in wishlist!",
        });
      }
      console.log("Updated user is ", updatedUser);
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
    const sensitiveData = {
      isSuccess: true,
      message: "Success",
      orderHistory: user.orderHistory,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({
    //   isSuccess: true,
    //   message: "Success",
    //   orderHistory: user.orderHistory,
    // });
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
    console.log("Inside get wishlist history route controller");
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
    const sensitiveData = {
      isSuccess: true,
      message: "Success",
      wishlist: user.wishlist,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({
    //   isSuccess: true,
    //   message: "Success",
    //   wishlist: user.wishlist,
    // });
  } catch (error) {
    console.log("Get Wishlist Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Get Wishlist failed" });
  }
};

const getCustomization = async (req, res) => {
  try {
    console.log("Inside get customization route controller");
    const { mobileNumber } = req.session.user;
    console.log(req.session);
    console.log(mobileNumber);
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Get Customization is ", user.customization);
    const sensitiveData = {
      isSuccess: true,
      message: "Success",
      customizeItem: user.customization,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({
    //   isSuccess: true,
    //   message: "Success",
    //   customizeItem: user.customization,
    // });
  } catch (error) {
    console.log("Get Customization Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Get Customization failed" });
  }
};

const getCartItems = async (req, res) => {
  try {
    console.log("Inside get cart items route controller");
    const mobileNumber = req.session.user.mobileNumber;
    const user = await User.findOne({ mobileNumber });
    console.log("User is ", user);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ isSuccess: false, message: "User not found" });
    }
    console.log("Get Cart Items is ", user.cart);
    const sensitiveData = {
      isSuccess: true,
      message: "Success",
      cartItems: user.cart,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({
    //   isSuccess: true,
    //   message: "Success",
    //   cartItems: user.cart,
    // });
  } catch (error) {
    console.log("Get Cart Items Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Get Cart Items failed" });
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

const submitCustomize = (req, res) => {
  try {
    console.log("Inside submit customize route controller");
    console.log(req.files);
    // console.log(req.body.summaryData);
    let files = req.files;
    let summaryData = req.body.summaryData;
    console.log("Summary Data is ", summaryData);
    let mobileNumber = req.session.user.mobileNumber;
    setTimeout(
      () =>
        sendMail("New Customization Request", summaryData, files, mobileNumber),
      2000
    );
    return res
      .status(200)
      .json({ isSuccess: true, message: "Successfully Uploaded" });
  } catch (error) {
    console.log("Submit Customized Summary Failed");
    console.log(error);
    return res
      .status(500)
      .json({ isSuccess: false, message: "Submit Customized Summary Failed" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    console.log("Inside delete a cart item controller in order routes");
    const cartId = req.params.id;
    console.log("Cart ID is ", cartId);
    const mobileNumber = req.session.user.mobileNumber;
    console.log("Mobile Number is ", mobileNumber);
    const user = await User.findOne({
      mobileNumber: req.session.user.mobileNumber,
    });

    if (!user) {
      console.log("User Not Found!");
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.cart);
    user.cart = user.cart.filter((item) => item.cartId !== cartId);
    req.session.user.cartLength = user.cart.length;
    await user.save();
    console.log("Cart Item deleted successfully");
    return res.status(200).json({
      message: "Cart Item deleted successfully",
      cartLength: req.session.user.cartLength,
    });
  } catch (error) {
    console.log("Could not delete cart item");
    return res
      .status(500)
      .json({ error: "Could not delete cart item", message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    console.log("Inside Update Cart By Id Controller");
    console.log(req.params);
    console.log(req.body);
    const cartId = req.params.id;
    const newQuantity = req.body.quantity; // Data to update from request body
    console.log("The cart Id is ", cartId);
    console.log("The quantity is ", newQuantity);

    const user = await User.findOne({
      mobileNumber: req.session.user.mobileNumber,
    });
    console.log("The update cart user is ", user);
    if (user) {
      // Update the cartArray element's quantity
      user.cart = user.cart.map((cartItem) => {
        console.log("CartItem User is ", cartItem.cartId);
        console.log("CartItem from request is ", cartId);
        if (cartItem.cartId === cartId) {
          console.log("Inside If");
          return {
            ...cartItem,
            quantity: newQuantity,
          };
        }
        return cartItem;
      });
      await user.save();
      console.log("Saved");
    }

    // Respond with the updated product details
    console.log("The Cart Updated Successfully!");
    const sensitiveData = {
      cart: user.cart,
    };
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(sensitiveData),
      process.env.SECRET
    ).toString();
    res.status(200).json({ encryptedData });
    // return res.status(200).json({ cart: user.cart });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addOrder,
  getOrderHistory,
  addWishlist,
  getWishList,
  deleteWishlist,
  submitCustomize,
  addToCart,
  getCartItems,
  deleteCartItem,
  updateCart,
  getCustomization,
};
