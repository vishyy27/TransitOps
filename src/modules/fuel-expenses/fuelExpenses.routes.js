const express = require('express');
const validate = require('../../middleware/validate');
const { createFuelLogSchema, createExpenseSchema } = require('./fuelExpenses.validation');
const fuelExpensesController = require('./fuelExpenses.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post('/fuel-logs', authorize('FLEET_MANAGER', 'DRIVER'), validate(createFuelLogSchema), asyncHandler(fuelExpensesController.createFuelLog));
router.get('/fuel-logs', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), asyncHandler(fuelExpensesController.getFuelLogs));

router.post('/expenses', authorize('FLEET_MANAGER', 'DRIVER'), validate(createExpenseSchema), asyncHandler(fuelExpensesController.createExpense));
router.get('/expenses', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), asyncHandler(fuelExpensesController.getExpenses));

module.exports = router;
