require("dotenv").config();

const PORT = process.env.PORT;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

module.exports = {
  PORT,
  DB_CONNECTION_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
