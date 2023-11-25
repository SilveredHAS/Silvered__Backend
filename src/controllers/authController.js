const passport = require("passport");
const axios = require("axios");

// Controller function for Google authentication callback
const emailLoginAuthentication = (req, res, next) => {
  passport.authenticate("custom-local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (
      info.message ===
        "The entered Email/Mobile do not exist. Please Sign up into Silvered" ||
      info.message === "Please enter correct Email/Mobile and Password"
    ) {
      return res.status(401).json({ message: info.message });
    }
    if (info.message === "Login Successfull") {
      return res.status(200).json({ message: info.message });
    } else {
      return res.status(500).json({ message: "Login failed" });
    }
  })(req, res, next);
};

const emailRegisterAuthentication = async (req, res) => {
  try {
    const { mobileNumber, email } = req.body;
    console.log("Inside auth/register route");
    console.log("Req Body is ", req.body);

    // Check if the email or mobile number already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingUser) {
      console.log("User account already exists");
      return res.status(409).json({
        message: "User account already exists. Please log in to your account",
      });
    }
    console.log("New Account!");
    res.status(200).json({ message: "New Account!" });
  } catch (error) {
    console.log("Registration Failed");
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const verifyOtpAndRegister = async (req, res) => {
  try {
    const { fullName, mobileNumber, email, password, verifiedOTP } = req.body;
    console.log("Req body of verify otp and register is ", req.body);
    // Verify the provided OTP (compare with the stored OTP, for example)
    // For demonstration, let's assume the verifiedOTP matches the stored OTP

    // ... your OTP verification logic ...

    // Now create the new user account
    const hashedPassword = await bcrypt.hash(password, 15);
    console.log("Hashed Password is ", hashedPassword);
    const user = new User({
      fullName,
      mobileNumber,
      email,
      password: hashedPassword,
    });
    await user.save();
    console.log("Account created successfully!");
    res.status(200).json({ message: "Registered successfully!" });
  } catch (error) {
    console.log("Registration Failed:", error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (!err) {
      // Logout was successful
      console.log("Logged Out Successfully!");
      res.status(200).json({ message: "Logged Out Successfully!" });
    } else {
      console.log("Logging Out Failed");
      console.log(error);
      res.status(500).json({ message: "Logging Out failed" });
    }
  });
};

const checkCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    // If the user is authenticated, send their details
    console.log("The user is Authenticated");
    res.json({ message: req.user });
  } else {
    // If the user is not authenticated, send an empty object or an appropriate response
    console.log("The user is not Authenticated");
    res.json({ message: "Unauthorized" });
  }
};

const sendOTP = (req, res) => {
  const options = {
    method: "POST",
    url: "https://control.msg91.com/api/v5/otp?template_id=1&mobile=919790082418&otp_length=6",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      authkey: "410614ARKo5S5jFiiY656246deP1",
    },
    data: { Param1: "value1", Param2: "value2", Param3: "value3" },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log("The response from send otp api request is ", response.data);
      res.status(200).json({ message: response.data });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: error });
    });
};

module.exports = {
  emailLoginAuthentication,
  emailRegisterAuthentication,
  verifyOtpAndRegister,
  logoutUser,
  checkCurrentUser,
  sendOTP,
};
