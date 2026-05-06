const User = require("../users/userModel");
const { AppError } = require("../../middleware/errorHandler");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

const signup = async (req, res, next) => {
  try {
    const { first_name, last_name, username, email, password, bio } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(
        new AppError("User with this email or username already exists", 400)
      );
    }

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password,
      bio,
    });

    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
