const express = require('express');
const validate = require('../../middleware/validate');
const paginationSchema = require('../../middleware/pagination');
const { createDriverSchema, updateDriverSchema, driverIdSchema } = require('./drivers.validation');
const driversController = require('./drivers.controller');
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

router.post('/', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validate(createDriverSchema), asyncHandler(driversController.createDriver));
router.get('/', validate(paginationSchema, 'query'), asyncHandler(driversController.getDrivers));
router.get('/:id', validateParams(driverIdSchema), asyncHandler(driversController.getDriverById));
router.patch('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validateParams(driverIdSchema), validate(updateDriverSchema), asyncHandler(driversController.updateDriver));

module.exports = router;
