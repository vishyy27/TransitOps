const prisma = require('../../prisma');

const createVehicle = async (data) => {
  const vehicle = await prisma.vehicle.create({
    data,
  });
  return vehicle;
};

const getVehicles = async (query) => {
  const { type, status, region, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (type) filter.type = type;
  if (status) filter.status = status;
  if (region) filter.region = region;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { created_at: 'desc' }
    }),
    prisma.vehicle.count({ where: filter })
  ]);

  return {
    data: vehicles,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take)
    }
  };
};

const getVehicleById = async (id) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return vehicle;
};

const updateVehicle = async (id, data) => {
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data,
  }).catch(() => null);
  
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return vehicle;
};

const retireVehicle = async (id) => {
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: { status: 'RETIRED' },
  }).catch(() => null);
  
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return vehicle;
};

const getOperationalCost = async (id) => {
  // Ensure vehicle exists
  await getVehicleById(id);

  const fuelLogs = await prisma.fuelLog.aggregate({
    where: { vehicle_id: id },
    _sum: { cost: true }
  });
  
  const maintenanceLogs = await prisma.maintenanceLog.aggregate({
    where: { vehicle_id: id },
    _sum: { cost: true }
  });
  
  const expenses = await prisma.expense.aggregate({
    where: { vehicle_id: id },
    _sum: { amount: true }
  });

  const fuel_total = fuelLogs._sum.cost || 0;
  const maintenance_total = maintenanceLogs._sum.cost || 0;
  const expense_total = expenses._sum.amount || 0;
  const total = fuel_total + maintenance_total + expense_total;

  return { fuel_total, maintenance_total, expense_total, total };
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  retireVehicle,
  getOperationalCost
};
