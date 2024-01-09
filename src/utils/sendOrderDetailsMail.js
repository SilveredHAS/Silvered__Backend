const nodemailer = require("nodemailer");
const { Order } = require("../models/order");
const Product = require("../models/product");
const GetShippingAddress = require("./getShippingAddress");

function getCurrentTimestamp() {
  const now = new Date();

  // Get individual date and time components
  const year = now.getFullYear().toString().slice(-2); // Get last two digits of the year
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Format the timestamp
  const formattedTimestamp = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

  return formattedTimestamp;
}

function jsonToHtmlTable(productDetails, cartDetails) {
  console.log("Inside json to html ", productDetails, cartDetails);
  //   jsonObject = JSON.parse(jsonObject);

  let table = '<table border="1">';

  // Create table headers
  table += "<tr><th>Key</th><th>Value</th></tr>";

  // Manually write key-value pairs for each field
  table += `<tr><td>Product Name</td><td>${productDetails.name}</td></tr>`;
  table += `<tr><td>Category</td><td>${productDetails.category}</td></tr>`;
  table += `<tr><td>Variant</td><td>${productDetails.variant}</td></tr>`;
  table += `<tr><td>Material</td><td>${productDetails.material}</td></tr>`;
  table += `<tr><td>Pattern</td><td>${productDetails.pattern}</td></tr>`;
  table += `<tr><td>Color</td><td>${productDetails.color}</td></tr>`;
  table += `<tr><td>Fit</td><td>${productDetails.fit}</td></tr>`;
  table += `<tr><td>Sleeve</td><td>${productDetails.sleeve}</td></tr>`;
  table += `<tr><td>GSM</td><td>${productDetails.gsm}</td></tr>`;

  // Display images as individual rows
  productDetails.images.forEach((image, index) => {
    image !== ""
      ? (table += `<tr><td>Image[${index}]</td><td>${image}</td></tr>`)
      : "";
  });

  table += `<tr><td>Size</td><td>${cartDetails.size}</td></tr>`;
  table += `<tr><td>Quantity</td><td>${cartDetails.quantity}</td></tr>`;
  table += `<tr><td>Logo Name</td><td>${cartDetails.logoName}</td></tr>`;

  table += "</table>";
  return table;
}

const SendOrderDetailsMail = async (orderId, mobileNumber) => {
  console.log("Inside send order mail function");
  const order = await Order.findOne({ orderId: orderId });
  let html = "<html>";
  html += "<br>";
  html += `<p>Order Id : ${orderId}</p>`;
  html += `<p>Mobile Number of User : ${mobileNumber}</p>`;
  html += `<p>Shopping Address : ${GetShippingAddress(
    order.shippingAddress
  )}</p>`;
  html += "<br>";
  const timestamp = getCurrentTimestamp();
  if (order) {
    const orderedProducts = order.products;
    console.log("OrderedProducts is ", orderedProducts);
    console.log(typeof orderedProducts);
    for (const product of orderedProducts) {
      const productId = product.productId;
      const foundProduct = await Product.findById(productId).exec();
      if (!foundProduct) {
        throw new Error("Product not found");
      }
      let orderTable = jsonToHtmlTable(foundProduct, product);
      html += orderTable;
      html += "<br><br>";
    }
  }
  html += "</html>";
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "silveredworkspace@gmail.com",
      pass: "wsxg gdbk ophd utbp",
    },
  });

  var mailOptions = {
    from: "silveredworkspace@gmail.com",
    to: "silveredworkspace@gmail.com",
    subject:
      "New Order Request : " + orderId + "-" + mobileNumber + ":" + timestamp,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { SendOrderDetailsMail };
