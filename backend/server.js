const express = require("express");
const dbConnect = require("./database/db");
const app = express();
const { PORT } = require("./config/config");

// Calling dbConnect function to connect to the database
dbConnect();

// Define a route for the root endpoint
app.get("/", (req, res) => {
  res.json({ msg: "Hello, world!" });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
