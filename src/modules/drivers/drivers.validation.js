const { z } = require('zod');

const createDriverSchema = z.object({
  name: z.string({ required_error: "Name is required." }).min(1, "Name cannot be empty."),
  license_number: z.string({ required_error: "License number is required." }).min(1, "License number cannot be empty."),
  license_category: z.string({ required_error: "License category is required." }).min(1, "License category cannot be empty."),
  license_expiry_date: z.string({ required_error: "License expiry date is required." }).datetime({ message: "License expiry date must be a valid ISO datetime." }),
  contact_number: z.string({ required_error: "Contact number is required." }).min(1, "Contact number cannot be empty."),
});

const updateDriverSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").optional(),
  license_category: z.string().min(1, "License category cannot be empty.").optional(),
  license_expiry_date: z.string().datetime({ message: "License expiry date must be a valid ISO datetime." }).optional(),
  contact_number: z.string().min(1, "Contact number cannot be empty.").optional(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'], { invalid_type_error: "Status must be one of: AVAILABLE, ON_TRIP, OFF_DUTY, SUSPENDED." }).optional(),
});

const driverIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Driver ID must be a valid integer.")
});

module.exports = { createDriverSchema, updateDriverSchema, driverIdSchema };
