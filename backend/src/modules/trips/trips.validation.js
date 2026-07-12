const { z } = require('zod');

const createTripSchema = z.object({
  source: z.string({ required_error: "Source is required." }).min(1, "Source cannot be empty."),
  destination: z.string({ required_error: "Destination is required." }).min(1, "Destination cannot be empty."),
  vehicle_id: z.number({ required_error: "Vehicle ID is required.", invalid_type_error: "Vehicle ID must be a number." }),
  driver_id: z.number({ required_error: "Driver ID is required.", invalid_type_error: "Driver ID must be a number." }),
  cargo_weight: z.number({ required_error: "Cargo weight is required.", invalid_type_error: "Cargo weight must be a number." }).positive("Cargo weight must be positive."),
  planned_distance: z.number({ required_error: "Planned distance is required.", invalid_type_error: "Planned distance must be a number." }).positive("Planned distance must be positive."),
  revenue: z.number({ required_error: "Revenue is required and must be a positive number.", invalid_type_error: "Revenue must be a number." }).positive("Revenue is required and must be a positive number.")
});

const completeTripSchema = z.object({
  final_odometer: z.number({ required_error: "Final odometer is required.", invalid_type_error: "Final odometer must be a number." }).positive("Final odometer must be positive."),
  fuel_consumed: z.number({ required_error: "Fuel consumed is required.", invalid_type_error: "Fuel consumed must be a number." }).positive("Fuel consumed must be positive."),
  fuel_cost: z.number({ invalid_type_error: "Fuel cost must be a number." }).nonnegative("Fuel cost cannot be negative.").optional(),
});

const tripIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Trip ID must be a valid integer.")
});

module.exports = { createTripSchema, completeTripSchema, tripIdSchema };
