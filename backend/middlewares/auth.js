const JWTService = require("../services/JWTService");
const User = require("../models/user");
const UserDTO = require("../dto/user");

const auth = async (req, res, next) => {
  try {
    // 1. refresh and access token validation
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;

    if (!refreshToken || !accessToken) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    // Verify access token
    let _id;
    try {
      _id = JWTService.verifyAccessToken(accessToken)._id;
    } catch (error) {
      return next(error);
    }

    // Find user by id
    let user;
    try {
      user = await User.findOne({ _id });
    } catch (error) {
      return next(error);
    }

    // Define userDto
    const userDto = new UserDTO(user);

    // Set userDto in request
    req.user = userDto;

    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = auth;
