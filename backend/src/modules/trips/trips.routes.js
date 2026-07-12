const express = require('express');
const validate = require('../../middleware/validate');
const paginationSchema = require('../../middleware/pagination');
const { createTripSchema, completeTripSchema, tripIdSchema } = require('./trips.validation');
const tripsController = require('./trips.controller');
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

router.post('/', authorize('FLEET_MANAGER', 'DRIVER'), validate(createTripSchema), asyncHandler(tripsController.createTrip));
router.post('/:id/dispatch', authorize('FLEET_MANAGER'), validateParams(tripIdSchema), asyncHandler(tripsController.dispatchTrip));
router.post('/:id/complete', authorize('FLEET_MANAGER', 'DRIVER'), validateParams(tripIdSchema), validate(completeTripSchema), asyncHandler(tripsController.completeTrip));
router.post('/:id/cancel', authorize('FLEET_MANAGER'), validateParams(tripIdSchema), asyncHandler(tripsController.cancelTrip));
router.get('/', validate(paginationSchema, 'query'), asyncHandler(tripsController.getTrips));

module.exports = router;
