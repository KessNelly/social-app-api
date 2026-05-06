const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");
const User = require("../modules/users/userModel");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError(
        "You are not logged in. Please login to access this route.",
        401
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token no longer exists.",
        401
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Your token has expired. Please login again.", 401)
      );
    }
    next(error);
  }
};

module.exports = protect;
