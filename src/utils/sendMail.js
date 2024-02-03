const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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

const sendMail = async (mobileNumber) => {
  console.log("Inside send mail function");
  const relativeTempStorageDir = "../../tempStorage";
  const tempStorageDir = path.join(__dirname, relativeTempStorageDir);
  const tempDirForTransaction = path.join(tempStorageDir, mobileNumber);
  let imageFiles = fs.readdirSync(tempDirForTransaction);
  console.log(imageFiles);

  imageFiles = imageFiles.filter(
    (fileName) =>
      (fileName.endsWith(".png") ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg")) &&
      fileName
  );
  console.log(imageFiles);

  const subject = "New Customization Request";
  const body = fs.readFileSync(
    path.join(tempDirForTransaction, "summaryData.json"),
    "utf-8"
  );
  console.log("JSON Body is ", body);
  const timestamp = getCurrentTimestamp();
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "silveredworkspace@gmail.com",
      pass: "wsxg gdbk ophd utbp",
    },
  });
  console.log("Image Files are ", imageFiles);
  const attachments = imageFiles.map((fileName) => ({
    filename: fileName,
    path: path.join(tempDirForTransaction, fileName),
  }));

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
      // fs.rm(tempDirForTransaction, { recursive: true });
      fs.promises
        .rm(tempDirForTransaction, { recursive: true }, (error) => {
          console.log(error);
        })
        .then((data) => {
          console.log(
            `Temporary storage cleaned up for ${tempDirForTransaction}`
          );
        })
        .catch((err) => console.log(err));
    }
  });
};

module.exports = { sendMail };
