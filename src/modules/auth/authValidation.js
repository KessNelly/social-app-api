const { z } = require("zod");

const signupSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .toLowerCase(),
  email: z.email("Please provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  bio: z.string().max(200).optional(),
});

const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
};
