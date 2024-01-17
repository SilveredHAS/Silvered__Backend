const Razorpay = require("razorpay");
const User = require("../models/user");
const { generateReceiptId } = require("../utils/generateReceiptId");
const { Order } = require("../models/order");
const { CheckRazorpaySignature } = require("../utils/checkRazorpaySignature");
const CryptoJS = require("crypto-js");
const { SendOrderDetailsMail } = require("../utils/sendOrderDetailsMail");

const getOrderId = async (req, res) => {
  try {
    console.log("Inside getOrderId function in payment controller");
    console.log("In getOrderId function, session data is ", req.session);
    console.log("Req.body is ", req.body);
    const { price, shippingAddress } = req.body;
    let generatedReceiptId = generateReceiptId();
    console.log("Generated Receipt Id is ", generatedReceiptId);
    let receiptId = req.session.user.mobileNumber + "-" + generatedReceiptId;
    console.log("Receipt Id is ", receiptId);

    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    let options = {
      amount: price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: receiptId,
    };
    instance.orders.create(options, function (err, order) {
      if (err) {
        console.log("Err is ", err);
        return res.status(500).json({
          isSuccess: false,
          message:
            "Something went wrong while making payment. Please try again later.",
        });
      }
      console.log("Success :", order);
      Order.create({
        orderId: order.id,
        receiptId,
        totalAmount: price,
        shippingAddress: shippingAddress,
      })
        .then((newOrder) => {
          // Handle the newly created order
          console.log("Newly created Order:", newOrder);
          req.session.user.orderId = order.id;
          const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(order),
            process.env.SECRET
          ).toString();
          res.status(200).json({ encryptedData });
          // return res.status(200).json(order);
        })
        .catch((error) => {
          // Handle error
          console.error("Error creating Order:", error);
          console.log("Get Order Id Failed");
          console.log(error);
          return res.status(500).json({
            isSuccess: false,
            message:
              "Something went wrong while making payment. Please try again later.",
          });
        });
    });
  } catch (error) {
    console.log("Get Order Id Failed");
    console.log(error);
    return res.status(500).json({
      isSuccess: false,
      message:
        "Something went wrong while making payment. Please try again later.",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log("The Response from verify payment is ", res);
    let errorMsg = "";
    const keys = Object.keys(res.req.body);
    console.log("The keys of response is ", keys);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      res.req.body;
    console.log(razorpay_payment_id, razorpay_order_id, razorpay_signature);
    const orderId = req.session.user.orderId;
    const isRazorpaySignatureValid = CheckRazorpaySignature(
      orderId,
      razorpay_payment_id,
      "GSkeBUV8MK2dVWnzSU2AkAHw",
      razorpay_signature
    );
    console.log("isRazorpaySignatureValid ", isRazorpaySignatureValid);
    const user = await User.findOne({
      mobileNumber: req.session.user.mobileNumber,
    });
    if (!user) {
      throw new Error("User not found");
    }
    const products = user.cart;
    const fieldsToUpdate = {
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      isPaymentSuccess: true,
      isPaymentVerified: true,
      isPaymentValid: isRazorpaySignatureValid,
      products: products,
      dateOfOrder: new Date(),
      status: "Confirmed",
    };
    const order = await Order.findOne({
      orderId: req.session.user.orderId,
    }).exec();
    const orderShippingAddress = order.shippingAddress;
    Order.findOneAndUpdate(
      {
        orderId: req.session.user.orderId,
      },
      { $set: fieldsToUpdate },
      { new: true }
    )
      .then((updatedOrder) => {
        // Handle the updated order
        user.cart = [];
        req.session.user.cartLength = user.cart.length;
        console.log("Shipping Address is ", orderShippingAddress);
        const existingAddressIndex = user.shippingAddresses.findIndex(
          (address) => {
            console.log("Iterative Address is ", address);
            return (
              address.firstName === orderShippingAddress.firstName &&
              address.lastName === orderShippingAddress.lastName &&
              address.mobileNumber === orderShippingAddress.mobileNumber &&
              address.email === orderShippingAddress.email &&
              address.houseNo === orderShippingAddress.houseNo &&
              address.area === orderShippingAddress.area &&
              address.city === orderShippingAddress.city &&
              address.state === orderShippingAddress.state &&
              address.pincode === orderShippingAddress.pincode &&
              address.landmark === orderShippingAddress.landmark
            );
          }
        );
        console.log("Existing Address Index is ", existingAddressIndex);
        if (existingAddressIndex === -1) {
          // Update the existing address if found
          user.shippingAddresses.push(orderShippingAddress);
        }
        user.orderHistory.push(updatedOrder);
        user.save().then((updatedUser) => {
          console.log(
            "Updated user after saving payment details:",
            updatedUser
          );
          console.log("Everything completed Successfully!");
          setTimeout(() => {
            SendOrderDetailsMail(
              req.session.user.orderId,
              req.session.user.mobileNumber
            );
          }, 5000);
        });
        console.log(
          "Updated Order after saving payment details:",
          updatedOrder
        );
      })
      .catch((error) => {
        // Handle error
        console.log(
          "The Payment is successfull but the order update failed.. and order id is ",
          req.session.user.orderId
        );
        console.error("Error updating payment details:", error);
      });
    res.redirect(`${process.env.FRONTEND_URL}/success`);
  } catch (error) {
    console.log("Verify Payment Failed");
    console.log(error);
  }
};

module.exports = {
  getOrderId,
  verifyPayment,
};
