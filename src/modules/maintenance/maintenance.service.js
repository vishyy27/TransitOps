const prisma = require('../../prisma');

const createMaintenanceLog = async (data) => {
  const { vehicle_id, description, cost } = data;
  
  try {
    const log = await prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicle_id } });
      if (!vehicle) throw { status: 404, message: 'Vehicle not found', code: 'NOT_FOUND' };
      if (vehicle.status === 'RETIRED') throw { status: 400, message: 'Vehicle is retired', code: 'RETIRED' };

      const maintenance = await tx.maintenanceLog.create({
        data: { vehicle_id, description, cost },
      });

      await tx.vehicle.update({
        where: { id: vehicle_id },
        data: { status: 'IN_SHOP' },
      });

      return maintenance;
    });

    return log;
  } catch (err) {
    console.error(`[Transaction Error] Failed to create maintenance log for vehicle ${vehicle_id}:`, err);
    throw err;
  }
};

const closeMaintenanceLog = async (id) => {
  try {
    const log = await prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenanceLog.findUnique({ where: { id }, include: { vehicle: true } });
      if (!maintenance) throw { status: 404, message: 'Maintenance log not found', code: 'NOT_FOUND' };
      if (maintenance.status === 'CLOSED') throw { status: 400, message: 'Log already closed', code: 'ALREADY_CLOSED' };

      const updated = await tx.maintenanceLog.update({
        where: { id },
        data: { status: 'CLOSED', closed_at: new Date() },
      });

      if (maintenance.vehicle.status !== 'RETIRED') {
        await tx.vehicle.update({
          where: { id: maintenance.vehicle_id },
          data: { status: 'AVAILABLE' },
        });
      }

      return updated;
    });

    return log;
  } catch (err) {
    console.error(`[Transaction Error] Failed to close maintenance log ${id}:`, err);
    throw err;
  }
};

const getMaintenanceLogs = async (query) => {
  const { vehicle_id, status, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (vehicle_id) filter.vehicle_id = parseInt(vehicle_id);
  if (status) filter.status = status;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [logs, total] = await Promise.all([
    prisma.maintenanceLog.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { created_at: 'desc' }
    }),
    prisma.maintenanceLog.count({ where: filter })
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

module.exports = {
  createMaintenanceLog,
  closeMaintenanceLog,
  getMaintenanceLogs
};
