const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;
    const conn = await mongoose.connect(uri);
    if (process.env.NODE_ENV !== "test") {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
