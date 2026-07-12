const { z } = require('zod');

const registerSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(1, "Name cannot be empty."),
  email: z.string({ required_error: "Email is required." }).email("Entered email is invalid."),
  password: z
    .string({ required_error: "Password is required." })
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
  role: z.enum(['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'], {
    required_error: "Role is required.",
    invalid_type_error: "Role must be one of: FLEET_MANAGER, DRIVER, SAFETY_OFFICER, FINANCIAL_ANALYST."
  })
});

const loginSchema = z.object({
  email: z.string({ required_error: "Email is required." }).email("Entered email is invalid."),
  password: z.string({ required_error: "Password is required." })
});

module.exports = { registerSchema, loginSchema };
