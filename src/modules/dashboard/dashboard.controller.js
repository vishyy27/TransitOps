const { stringify } = require('csv-stringify');
const dashboardService = require('./dashboard.service');

const getDashboardKPIs = async (req, res) => {
  const kpis = await dashboardService.getDashboardKPIs();
  res.json({ success: true, data: kpis });
};

const getFuelEfficiencyReport = async (req, res) => {
  const report = await dashboardService.getFuelEfficiencyReport();
  res.json({ success: true, data: report });
};

const getFleetUtilization = async (req, res) => {
  const report = await dashboardService.getFleetUtilization();
  res.json({ success: true, data: report });
};

const getOperationalCost = async (req, res) => {
  const report = await dashboardService.getOperationalCost();
  res.json({ success: true, data: report });
};

const getVehicleROI = async (req, res) => {
  const report = await dashboardService.getVehicleROI();
  res.json({ success: true, data: report });
};

const exportCsv = async (req, res, next) => {
  try {
    const { type } = req.query;
    const data = await dashboardService.getExportData(type);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
    
    stringify(data, { header: true }).pipe(res);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

module.exports = {
  getDashboardKPIs,
  getFuelEfficiencyReport,
  getFleetUtilization,
  getOperationalCost,
  getVehicleROI,
  exportCsv
};
