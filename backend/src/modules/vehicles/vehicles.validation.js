const { z } = require('zod');

const createVehicleSchema = z.object({
  registration_number: z.string({ required_error: "Registration number is required." }).min(1, "Registration number cannot be empty."),
  name: z.string({ required_error: "Name is required." }).min(1, "Name cannot be empty."),
  type: z.string({ required_error: "Type is required." }).min(1, "Type cannot be empty."),
  max_load_capacity: z.number({ required_error: "Max load capacity is required.", invalid_type_error: "Max load capacity must be a number." }).positive("Max load capacity must be positive."),
  acquisition_cost: z.number({ required_error: "Acquisition cost is required.", invalid_type_error: "Acquisition cost must be a number." }).positive("Acquisition cost must be positive."),
  region: z.string({ required_error: "Region is required." }).min(1, "Region cannot be empty."),
});

const updateVehicleSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").optional(),
  type: z.string().min(1, "Type cannot be empty.").optional(),
  max_load_capacity: z.number({ invalid_type_error: "Max load capacity must be a number." }).positive("Max load capacity must be positive.").optional(),
  acquisition_cost: z.number({ invalid_type_error: "Acquisition cost must be a number." }).positive("Acquisition cost must be positive.").optional(),
  region: z.string().min(1, "Region cannot be empty.").optional(),
});

const vehicleIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "Vehicle ID must be a valid integer.")
});

module.exports = { createVehicleSchema, updateVehicleSchema, vehicleIdSchema };
