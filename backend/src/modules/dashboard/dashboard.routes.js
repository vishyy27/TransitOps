const express = require('express');
const dashboardController = require('./dashboard.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/dashboard/kpis', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), asyncHandler(dashboardController.getDashboardKPIs));
router.get('/reports/fuel-efficiency', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), asyncHandler(dashboardController.getFuelEfficiencyReport));
router.get('/reports/fleet-utilization', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), asyncHandler(dashboardController.getFleetUtilization));
router.get('/reports/operational-cost', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), asyncHandler(dashboardController.getOperationalCost));
router.get('/reports/vehicle-roi', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), asyncHandler(dashboardController.getVehicleROI));
router.get('/reports/export/csv', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), dashboardController.exportCsv);

module.exports = router;
