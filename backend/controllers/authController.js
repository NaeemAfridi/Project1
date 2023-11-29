const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");
const RefreshToken = require("../models/token");

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const authController = {
  //registration controller
  async register(req, res, next) {
    //1. validate user input
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userRegisterSchema.validate(req.body);

    //2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    //3. if email or username already registered -> return an error
    const { username, email, password } = req.body;

    //3.1 check if email is not registered
    try {
      const eamilInUse = await User.exists({ email });

      const usernameInUse = await User.exists({ username });

      if (eamilInUse) {
        const error = {
          status: 409,
          message: "Email already registered! use another email",
        };
        return next(error);
      }

      if (usernameInUse) {
        const error = {
          status: 409,
          message: "username not available! choose another username",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //4.password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    //5.store user data in db
    let accessToken;
    let refreshToken;
    let user;
    try {
      const userToRegistered = new User({
        username,
        email,
        password: hashedPassword,
      });

      user = await userToRegistered.save();

      //token generation
      accessToken = JWTService.signAccessToken(
        { _id: user._id, username: user.username },
        "30m"
      );

      refreshToken = JWTService.signRefreshToken(
        { _id: user._id, username: user.username },
        "60m"
      );
    } catch (error) {}

    //store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, user._id);

    //send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //converting user object to dto
    const userDTO = new UserDTO(user);
    //6.response send
    return res.status(201).json({ user: userDTO });
  },

  //login controller
  async login(req, res, next) {
    //1. validate user input
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    //destruct error
    const { error } = userLoginSchema.validate(req.body);
    //2.if validation error -> return error
    if (error) {
      return next(error);
    }

    //destructring username and password from req.body object
    const { username, password } = req.body;

    //definenig the user variable globally
    let user;
    //3.match username and password
    try {
      //match username
      user = await User.findOne({ username: username });
      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };
        return next(error);
      }

      //match password
      //1st hash the password stored in db then match it
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    //
    const accessToken = JWTService.signAccessToken({ _id: user._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: user._id }, "60m");

    //update refresh token in db
    try {
      await RefreshToken.updateOne(
        {
          _id: user._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    //send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    //converting user object to dto
    const userDTO = new UserDTO(user);

    //4.return response
    return res.status(200).json({ user: userDTO });
  },
};

module.exports = authController;
