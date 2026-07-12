const { z } = require('zod');

const createMaintenanceSchema = z.object({
  vehicle_id: z.number({ required_error: "Vehicle ID is required.", invalid_type_error: "Vehicle ID must be a number." }),
  description: z.string({ required_error: "Description is required." }).min(1, "Description cannot be empty."),
  cost: z.number({ required_error: "Cost is required.", invalid_type_error: "Cost must be a number." }).nonnegative("Cost cannot be negative."),
});

const maintenanceIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Maintenance ID must be a valid integer.")
});

module.exports = { createMaintenanceSchema, maintenanceIdSchema };
