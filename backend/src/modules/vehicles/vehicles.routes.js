const express = require('express');
const validate = require('../../middleware/validate');
const paginationSchema = require('../../middleware/pagination');
const { createVehicleSchema, updateVehicleSchema, vehicleIdSchema } = require('./vehicles.validation');
const vehiclesController = require('./vehicles.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate);

// Request param validator wrapper
const validateParams = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params);
    next();
  } catch (err) {
    next(err);
  }
};

router.post('/', authorize('FLEET_MANAGER'), validate(createVehicleSchema), asyncHandler(vehiclesController.createVehicle));
router.get('/', validate(paginationSchema, 'query'), asyncHandler(vehiclesController.getVehicles));
router.get('/:id', validateParams(vehicleIdSchema), asyncHandler(vehiclesController.getVehicleById));
router.patch('/:id', authorize('FLEET_MANAGER'), validateParams(vehicleIdSchema), validate(updateVehicleSchema), asyncHandler(vehiclesController.updateVehicle));
router.delete('/:id', authorize('FLEET_MANAGER'), validateParams(vehicleIdSchema), asyncHandler(vehiclesController.deleteVehicle));
router.get('/:id/operational-cost', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), validateParams(vehicleIdSchema), asyncHandler(vehiclesController.getOperationalCost));

module.exports = router;
