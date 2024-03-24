const Razorpay = require("razorpay");
const User = require("../models/user");
const { generateReceiptId } = require("../utils/generateReceiptId");
const { Order } = require("../models/order");
const { CheckRazorpaySignature } = require("../utils/checkRazorpaySignature");
const CryptoJS = require("crypto-js");
const { SendOrderDetailsMail } = require("../utils/sendOrderDetailsMail");
const { sendMail } = require("../utils/sendMail");
const { addAffiliateAmount } = require("./authController");
const crypto = require("crypto");
const fs = require("fs");
const cashgramSdk = require("api")("@cashfreedocs-new/v4#i7dxxzloy7ysqr");
const axios = require("axios");
const cfSdk = require("cashfree-sdk");

const getOrderId = async (req, res) => {
  try {
    console.log("Inside getOrderId function in payment controller");
    console.log("In getOrderId function, session data is ", req.session);
    console.log("Req.body is ", req.body);
    const { price, shippingAddress, type, couponCode, couponCodeDiscount } =
      req.body;
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
        orderType: type === "CUSTOMIZE" ? "customize" : "order",
        isCouponCodeValid: couponCode ? true : false,
        couponCode: couponCode ? couponCode : null,
        couponCodeDiscount: couponCode ? 0.1 * (price - 100) : 0,
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
    const origin = req.get("Origin");
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
      customerId: req.session.user.mobileNumber,
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
    const isCouponCodeValid = order.isCouponCodeValid;
    const couponCode = order.couponCode;
    const couponCodeDiscount = order.couponCodeDiscount;
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
        if (updatedOrder.orderType === "order") {
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
        }

        user.save().then((updatedUser) => {
          console.log(
            "Updated user after saving payment details:",
            updatedUser
          );
          console.log("Everything completed Successfully!");
          setTimeout(() => {
            updatedOrder.orderType === "order"
              ? SendOrderDetailsMail(
                  req.session.user.orderId,
                  req.session.user.mobileNumber
                )
              : sendMail(req.session.user.mobileNumber);
          }, 10000);
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
    const updatedOrder = await Order.findOne({
      orderId: req.session.user.orderId,
    }).exec();
    console.log(
      "Redirecting to ",
      `${origin}/success?type=${updatedOrder.orderType}`
    );
    res.redirect(`${origin}/success?type=${updatedOrder.orderType}`);
    if (isCouponCodeValid) {
      setTimeout(
        () => addAffiliateAmount(couponCode, couponCodeDiscount),
        5000
      );
    }
  } catch (error) {
    console.log("Verify Payment Failed");
    console.log(error);
  }
};

const affiliatePayCommission = async (req, res) => {
  try {
    console.log("Inside affiliate pay commission controller");
    const filePath = "E:/Github/Silvered__Backend/key/public_key.pem";
    let publicKey = null;
    if (fs.existsSync(filePath)) {
      publicKey = fs.readFileSync(filePath, "utf-8");
      console.log("The publicKey Data is", publicKey);
    } else {
      console.error("File does not exist:", filePath);
    }
    const clientId = "CF10111733CNHC4T7UOMN4OBNU875G";
    console.log("The clientid is ", clientId);
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    const appendedClientId = `${clientId}.${currentUnixTimestamp}`;
    console.log("The appendedClientId Data is ", appendedClientId);

    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(appendedClientId, "utf-8")
    );
    console.log("The encrypted Data is ", encryptedData);
    const encryptedBase64 = encryptedData.toString("base64");
    console.log("The encryptedBase64 Data is ", encryptedBase64);

    const url = "https://payout-gamma.cashfree.com/payout/v1/authorize/";
    const headers = {
      "X-Client-Id": "CF10111733CNHC4T7UOMN4OBNU875G",
      "X-Client-Secret":
        "cfsk_ma_test_829e4d94a80692a94548dbae59d3977b_9e324992",
      accept: "application/json",
      "X-Cf-Signature": encryptedBase64,
      // Add more headers as needed
    };

    axios
      .post(url, {
        headers: headers,
      })
      .then((response) => {
        console.log("The Bearer Token is ", response);
        res.status(200).json({ msg: response.data });
      })
      .catch((error) => {
        console.error(error);
      });

    // const { Payouts } = cfSdk;
    // const payoutsInstance = new Payouts({
    //   env: "TEST",
    //   clientId: "CF10111733CNHC4T7UOMN4OBNU875G",
    //   clientSecret: "cfsk_ma_test_829e4d94a80692a94548dbae59d3977b_9e324992",
    //   pathToPublicKey: "E:/Github/Silvered__Backend/key/public_key.pem",
    //   //"publicKey": "ALTERNATIVE TO SPECIFYING PATH (DIRECTLY PASTE PublicKey)"
    // });

    // console.log(payoutsInstance);

    // cashgramSdk.auth("CF10111733CNHC4T7UOMN4OBNU875G");
    // cashgramSdk.auth("cfsk_ma_test_829e4d94a80692a94548dbae59d3977b_9e324992");
    // cashgramSdk.auth(encryptedBase64);
    // cashgramSdk
    //   .generateBearerToken()
    //   .then(({ data }) => console.log("The Bearer Token is ", data))
    //   .catch((err) => console.error(err));
  } catch (error) {
    console.log("The error is ", error);
    res
      .status(500)
      .json({ error: "Could not process affiliate pay commission" });
  }
};

module.exports = {
  getOrderId,
  verifyPayment,
  affiliatePayCommission,
};
