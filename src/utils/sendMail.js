const nodemailer = require("nodemailer");

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

function jsonToHtmlTable(jsonObject, mobileNumber) {
  jsonObject = JSON.parse(jsonObject);
  console.log("JSON Obj in utility is ", jsonObject);
  console.log(typeof jsonObject);
  let html = `<p>User Mobile Number is ${mobileNumber}</p><br>`;
  html += '<table border="1">';
  jsonObject.forEach((obj) => {
    for (let key in obj) {
      if (key && obj[key]) {
        html += `<tr><td>${key}</td><td>${obj[key]}</td></tr>`;
      }
    }
  });
  html += "</table>";
  return html;
}

const sendMail = (subject, body, files, mobileNumber) => {
  console.log("Inside send mail function");
  console.log("JSON Body is ", body);
  const timestamp = getCurrentTimestamp();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "silveredworkspace@gmail.com",
      pass: "wsxg gdbk ophd utbp",
    },
  });

  const attachments = [
    // Assuming attachments is an array of File objects obtained from the form input
    // Loop through each File object and convert it to Nodemailer attachment format
    // This example assumes you have an array named `files` containing your File objects
    ...files.map((file) => ({
      filename: file.originalname, // Set the filename to the original file name
      path: file.path, // Set the file content
    })),
  ];

  var mailOptions = {
    from: "silveredworkspace@gmail.com",
    to: "silveredworkspace@gmail.com",
    subject: subject + "-" + mobileNumber + ":" + timestamp,
    html: jsonToHtmlTable(body, mobileNumber),
    attachments: attachments,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendMail };
