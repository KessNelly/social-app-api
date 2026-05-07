const jwt = require("jsonwebtoken");
const { AppError } = require("./errorHandler");
const User = require("../modules/users/userModel");

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log(
        "Token Extracted:",
        token ? token.substring(0, 20) + "..." : "null"
      );
    }

    if (!token) {
      return next(new AppError("No token provided. Please login.", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      console.log("User not found");
      return next(new AppError("User not found", 401));
    }

    req.user = currentUser;
    console.log("Authentication Successful for user:", currentUser.username);
    next();
  } catch (error) {
    console.log("Auth Middleware Error:", error.name, "-", error.message);
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token has expired", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    }
    next(new AppError("Authentication failed", 401));
  }
};

module.exports = protect;
