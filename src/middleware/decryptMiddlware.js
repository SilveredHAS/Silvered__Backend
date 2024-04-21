const CryptoJS = require("crypto-js");

// Decryption middleware function
const DecryptMiddleware = (req, res, next) => {
  try {
    console.log("Req Body in decrypt middleware is ", req.body);
    const encryptedData = req.body.encryptedData;
    const decryptedData = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.SECRET
    ).toString(CryptoJS.enc.Utf8);
    console.log("Decrypted Data is ", decryptedData);
    req.body = JSON.parse(decryptedData);
    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.log("Decryption Failed ", error);
    res.status(500).json({ error: "Decryption failed" });
  }
};

module.exports = DecryptMiddleware;
