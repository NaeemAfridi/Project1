const express = require("express");
const dbConnect = require("./database/db");
const { PORT } = require("./config/config");
const router = require("./routes/routes");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//calling app
const app = express();

//using cookie-parser
app.use(cookieParser());

// Enable CORS with specific configurations
app.use(
  cors({
    origin: "http://localhost:5174", // Specify the allowed origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow sending cookies
  })
);

//to allow and accept and can send json data
app.use(express.json());

//router
app.use("/api/users", router);

// Calling dbConnect function to connect to the database
dbConnect();

//

//middlewares
app.use(errorHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
