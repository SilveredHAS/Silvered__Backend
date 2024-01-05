const Razorpay = require("razorpay");
const User = require("../models/user");
const { generateReceiptId } = require("../utils/generateReceiptId");
const { Order } = require("../models/order");
const { CheckRazorpaySignature } = require("../utils/checkRazorpaySignature");

const getOrderId = async (req, res) => {
  try {
    console.log("Inside getOrderId function in payment controller");
    console.log("In getOrderId function, session data is ", req.session);
    console.log("Req.body is ", req.body);
    let generatedReceiptId = generateReceiptId();
    console.log("Generated Receipt Id is ", generatedReceiptId);
    let receiptId = req.session.user.mobileNumber + "-" + generatedReceiptId;
    console.log("Receipt Id is ", receiptId);

    let instance = new Razorpay({
      key_id: "rzp_test_OOM7hGgD0wmUx5",
      key_secret: "GSkeBUV8MK2dVWnzSU2AkAHw",
    });
    let options = {
      amount: req.body.price, // amount in the smallest currency unit
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
      })
        .then((newOrder) => {
          // Handle the newly created order
          console.log("Newly created Order:", newOrder);
          req.session.user.orderId = order.id;
          return res.status(200).json(order);
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
    const fieldsToUpdate = {
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      isPaymentSuccess: true,
      isPaymentVerified: true,
      isPaymentValid: isRazorpaySignatureValid,
    };

    Order.findOneAndUpdate(
      {
        orderId: req.session.user.orderId,
      },
      { $set: fieldsToUpdate },
      { new: true }
    )
      .then((updatedOrder) => {
        // Handle the updated order
        console.log(
          "Updated Order after saving payment details:",
          updatedOrder
        );
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating payment details:", error);
      });
    res.redirect("http://www.silvered.store/success");
  } catch (error) {
    console.log("Verify Payment Failed");
    console.log(error);
  }
};

module.exports = {
  getOrderId,
  verifyPayment,
};
