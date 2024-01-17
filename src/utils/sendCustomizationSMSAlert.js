const request = require("request");
const SendCustomizationAlertSMS = (mobileNumber) => {
  try {
    console.log("Inside sendCustomizationAlertSMS route controller");
    console.log("Mobile Number is ", mobileNumber);
    let sms =
      "Your customized product is ready. Please visit www.silvered.store to view your customized product";

    const options = {
      method: "GET",
      url: `https://api.authkey.io/request?authkey=665dfb34d6f620d9&mobile=${mobileNumber}&country_code=91&sid=10995&name=Silvered&sms=${sms}&company=Silvered Account`,
    };

    request(options, function (error, response, body) {
      console.log("Response Body is");
      console.log(response);
      console.log(response.body);
      if (error) {
        console.log("Error while sending SMS Alert");
        // return res.status(500).json({
        //   isSuccess: false,
        // });
      }
      if (response.body.includes("Submitted Successfully")) {
        console.log("SMS Alert Sent Successfully!");
        // return res.status(200).json({
        //   isSuccess: true,
        // });
      } else {
        console.log("Could not send SMS Alert");
        // return res.status(200).json({
        //   isSuccess: false,
        // });
      }
    });
  } catch (error) {
    console.log("Send SMS Alert Failed");
    console.log(error);
    // res.status(500).json({ message: "Error while sending SMS Alert" });
  }
};

module.exports = SendCustomizationAlertSMS;
