const express = require("express");
const { signup, login } = require("../modules/auth/authController");
const { signupSchema, loginSchema } = require("../modules/auth/authValidation");
const { AppError } = require("../middleware/errorHandler");

const router = express.Router();

//Validation Middleware
const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const message =
        error.errors?.map((err) => err.message).join(", ") || "Invalid input";
      return next(new AppError(message, 400));
    }
  };
};

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

module.exports = router;
