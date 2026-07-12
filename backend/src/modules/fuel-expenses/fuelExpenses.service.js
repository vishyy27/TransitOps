const prisma = require('../../prisma');

const createFuelLog = async (data) => {
  const payload = { ...data };
  if (payload.date) payload.date = new Date(payload.date);
  
  const log = await prisma.fuelLog.create({ data: payload });
  return log;
};

const createExpense = async (data) => {
  const payload = { ...data };
  if (payload.date) payload.date = new Date(payload.date);
  
  const expense = await prisma.expense.create({ data: payload });
  return expense;
};

// Added pagination for lists since it's a general requirement
const getFuelLogs = async (query) => {
  const { vehicle_id, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (vehicle_id) filter.vehicle_id = parseInt(vehicle_id);
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [logs, total] = await Promise.all([
    prisma.fuelLog.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { date: 'desc' }
    }),
    prisma.fuelLog.count({ where: filter })
  ]);

  return {
    data: logs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take)
    }
  };
};

const getExpenses = async (query) => {
  const { vehicle_id, type, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (vehicle_id) filter.vehicle_id = parseInt(vehicle_id);
  if (type) filter.type = type;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { date: 'desc' }
    }),
    prisma.expense.count({ where: filter })
  ]);

  return {
    data: expenses,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take)
    }
  };
};

module.exports = {
  createFuelLog,
  createExpense,
  getFuelLogs,
  getExpenses
};
