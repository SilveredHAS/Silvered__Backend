const CryptoJS = require("crypto-js");

// Decryption middleware function
const DecryptMiddleware = (req, res, next) => {
  console.log("Req Body in decrypt middleware is ", req.body);
  const encryptedData = req.body.encryptedData;
  try {
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);
    req.body = JSON.parse(decryptedData);
    next(); // Move to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ error: "Decryption failed" });
  }
};

module.exports = DecryptMiddleware;
