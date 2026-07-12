const vehiclesService = require('./vehicles.service');

const createVehicle = async (req, res) => {
  const vehicle = await vehiclesService.createVehicle(req.body);
  res.status(201).json({ success: true, data: vehicle });
};

const getVehicles = async (req, res) => {
  const result = await vehiclesService.getVehicles(req.query);
  res.json({ success: true, ...result });
};

const getVehicleById = async (req, res) => {
  const vehicle = await vehiclesService.getVehicleById(parseInt(req.params.id));
  res.json({ success: true, data: vehicle });
};

const updateVehicle = async (req, res) => {
  const vehicle = await vehiclesService.updateVehicle(parseInt(req.params.id), req.body);
  res.json({ success: true, data: vehicle });
};

const deleteVehicle = async (req, res) => {
  await vehiclesService.retireVehicle(parseInt(req.params.id));
  res.json({ success: true, message: 'Vehicle retired successfully' });
};

const getOperationalCost = async (req, res) => {
  const cost = await vehiclesService.getOperationalCost(parseInt(req.params.id));
  res.json({ success: true, data: cost });
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getOperationalCost
};
