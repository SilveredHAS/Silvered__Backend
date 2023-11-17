const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    const uri =
      "mongodb+srv://silvered:JRNLxEX6VAhFThe5@cluster0.lpcuahe.mongodb.net/?retryWrites=true&w=majority";
    const connection = await mongoose.connect(uri);
    console.log("Connected to MongoDB Successfully for Silvered");
    return connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = connectToMongoDB;
