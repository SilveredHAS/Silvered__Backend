const { v4: uuidv4 } = require("uuid");

function generateReceiptId() {
  return uuidv4().substr(0, 10).replace(/-/g, "");
}

module.exports = { generateReceiptId };
