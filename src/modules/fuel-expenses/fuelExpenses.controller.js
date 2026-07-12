const fuelExpensesService = require('./fuelExpenses.service');

const createFuelLog = async (req, res) => {
  const log = await fuelExpensesService.createFuelLog(req.body);
  res.status(201).json({ success: true, data: log });
};

const createExpense = async (req, res) => {
  const expense = await fuelExpensesService.createExpense(req.body);
  res.status(201).json({ success: true, data: expense });
};

const getFuelLogs = async (req, res) => {
  const result = await fuelExpensesService.getFuelLogs(req.query);
  res.json({ success: true, ...result });
};

const getExpenses = async (req, res) => {
  const result = await fuelExpensesService.getExpenses(req.query);
  res.json({ success: true, ...result });
};

module.exports = {
  createFuelLog,
  createExpense,
  getFuelLogs,
  getExpenses
};
