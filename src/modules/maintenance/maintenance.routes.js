const express = require('express');
const validate = require('../../middleware/validate');
const { createMaintenanceSchema, maintenanceIdSchema } = require('./maintenance.validation');
const maintenanceController = require('./maintenance.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate);

const validateParams = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params);
    next();
  } catch (err) {
    next(err);
  }
};

router.post('/', authorize('FLEET_MANAGER'), validate(createMaintenanceSchema), asyncHandler(maintenanceController.createMaintenanceLog));
router.patch('/:id/close', authorize('FLEET_MANAGER'), validateParams(maintenanceIdSchema), asyncHandler(maintenanceController.closeMaintenanceLog));
router.get('/', asyncHandler(maintenanceController.getMaintenanceLogs));

module.exports = router;
