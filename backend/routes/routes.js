const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ***** user ****** //
//register
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

//logout
//refresh

// ***** blog ****** //
//CRUD
//create
//read all blogs
// reade single blog by id
//update
//delete

// ***** comment ****** //
//create
//read comments by blog id

module.exports = router;
