const driversService = require('./drivers.service');

const createDriver = async (req, res) => {
  const driver = await driversService.createDriver(req.body);
  res.status(201).json({ success: true, data: driver });
};

const getDrivers = async (req, res) => {
  const result = await driversService.getDrivers(req.query);
  res.json({ success: true, ...result });
};

const getDriverById = async (req, res) => {
  const driver = await driversService.getDriverById(parseInt(req.params.id));
  res.json({ success: true, data: driver });
};

const updateDriver = async (req, res) => {
  const driver = await driversService.updateDriver(parseInt(req.params.id), req.body);
  res.json({ success: true, data: driver });
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver
};
