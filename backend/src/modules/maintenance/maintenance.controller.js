const maintenanceService = require('./maintenance.service');

const createMaintenanceLog = async (req, res, next) => {
  try {
    const log = await maintenanceService.createMaintenanceLog(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

const closeMaintenanceLog = async (req, res, next) => {
  try {
    const log = await maintenanceService.closeMaintenanceLog(parseInt(req.params.id));
    res.json({ success: true, data: log });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

const getMaintenanceLogs = async (req, res) => {
  const result = await maintenanceService.getMaintenanceLogs(req.query);
  res.json({ success: true, ...result });
};

module.exports = {
  createMaintenanceLog,
  closeMaintenanceLog,
  getMaintenanceLogs
};
