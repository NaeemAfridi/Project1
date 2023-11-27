const mongoose = require("mongoose");
const { DB_CONNECTION_URL } = require("../config/config");

const dbConnect = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(DB_CONNECTION_URL);
    console.log(`Database Connected To Host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

module.exports = dbConnect;
