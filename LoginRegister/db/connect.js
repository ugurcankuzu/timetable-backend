const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url, {
      
      
    });
    console.log("connection successful");
  } catch (error) {
    console.error("connection error:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
