const { z } = require('zod');

const createFuelLogSchema = z.object({
  liters: z.number({ required_error: "Liters is required.", invalid_type_error: "Liters must be a number." }).positive("Liters must be positive."),
  cost: z.number({ required_error: "Cost is required.", invalid_type_error: "Cost must be a number." }).nonnegative("Cost cannot be negative."),
  date: z.string().datetime({ message: "Date must be a valid ISO datetime." }).optional(),
  vehicle_id: z.number({ required_error: "Vehicle ID is required.", invalid_type_error: "Vehicle ID must be a number." }),
  trip_id: z.number({ invalid_type_error: "Trip ID must be a number." }).optional(),
});

const createExpenseSchema = z.object({
  type: z.enum(['TOLL', 'OTHER'], { required_error: "Type is required.", invalid_type_error: "Type must be one of: TOLL, OTHER." }),
  amount: z.number({ required_error: "Amount is required.", invalid_type_error: "Amount must be a number." }).nonnegative("Amount cannot be negative."),
  date: z.string().datetime({ message: "Date must be a valid ISO datetime." }).optional(),
  vehicle_id: z.number({ required_error: "Vehicle ID is required.", invalid_type_error: "Vehicle ID must be a number." }),
  description: z.string({ required_error: "Description is required." }).min(1, "Description cannot be empty."),
});

module.exports = { createFuelLogSchema, createExpenseSchema };
