const prisma = require('../../prisma');

const createTrip = async (data) => {
  const { vehicle_id, cargo_weight } = data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicle_id } });
  
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  
  if (cargo_weight > vehicle.max_load_capacity) {
    const error = new Error(`Cargo weight (${cargo_weight}kg) exceeds vehicle's maximum load capacity (${vehicle.max_load_capacity}kg).`);
    error.status = 400;
    error.code = 'OVERWEIGHT';
    throw error;
  }

  const trip = await prisma.trip.create({
    data,
  });
  return trip;
};

const dispatchTrip = async (id) => {
  try {
    const trip = await prisma.$transaction(async (tx) => {
      const t = await tx.trip.findUnique({ where: { id }, include: { vehicle: true, driver: true } });
      if (!t) throw { status: 404, message: 'Trip not found', code: 'NOT_FOUND' };
      if (t.status !== 'DRAFT') throw { status: 400, message: 'Trip must be in DRAFT status', code: 'INVALID_STATUS' };
      
      if (t.vehicle.status === 'ON_TRIP') throw { status: 400, message: 'Vehicle is already assigned to an active trip.', code: 'VEHICLE_ON_TRIP' };
      if (t.vehicle.status !== 'AVAILABLE') throw { status: 400, message: `Vehicle is not available (Current status: ${t.vehicle.status})`, code: 'VEHICLE_UNAVAILABLE' };
      
      if (t.driver.status === 'SUSPENDED') throw { status: 400, message: 'Driver is currently suspended and cannot be assigned to a trip.', code: 'DRIVER_SUSPENDED' };
      if (t.driver.status !== 'AVAILABLE') throw { status: 400, message: `Driver is not available (Current status: ${t.driver.status})`, code: 'DRIVER_UNAVAILABLE' };
      
      if (t.driver.license_expiry_date < new Date()) {
        const dateStr = t.driver.license_expiry_date.toISOString().split('T')[0];
        throw { status: 400, message: `Driver's license expired on ${dateStr} and cannot be assigned to a trip.`, code: 'LICENSE_EXPIRED' };
      }

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: 'DISPATCHED' }
      });

      await tx.vehicle.update({ where: { id: t.vehicle_id }, data: { status: 'ON_TRIP' } });
      await tx.driver.update({ where: { id: t.driver_id }, data: { status: 'ON_TRIP' } });

      return updatedTrip;
    });
    return trip;
  } catch (err) {
    console.error(`[Transaction Error] Failed to dispatch trip ${id}:`, err);
    throw err;
  }
};

const completeTrip = async (id, data) => {
  const { final_odometer, fuel_consumed, revenue, fuel_cost } = data;
  
  try {
    const trip = await prisma.$transaction(async (tx) => {
      const t = await tx.trip.findUnique({ where: { id }, include: { vehicle: true } });
      if (!t) throw { status: 404, message: 'Trip not found', code: 'NOT_FOUND' };
      if (t.status !== 'DISPATCHED') throw { status: 400, message: 'Trip must be DISPATCHED', code: 'INVALID_STATUS' };
      if (final_odometer <= t.vehicle.odometer) throw { status: 400, message: 'Final odometer must be greater than current odometer', code: 'INVALID_ODOMETER' };

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: 'COMPLETED', final_odometer, fuel_consumed, revenue }
      });

      await tx.vehicle.update({ 
        where: { id: t.vehicle_id }, 
        data: { status: 'AVAILABLE', odometer: final_odometer } 
      });
      await tx.driver.update({ where: { id: t.driver_id }, data: { status: 'AVAILABLE' } });

      await tx.fuelLog.create({
        data: {
          vehicle_id: t.vehicle_id,
          trip_id: id,
          liters: fuel_consumed,
          cost: fuel_cost || 0,
        }
      });

      return updatedTrip;
    });
    return trip;
  } catch (err) {
    console.error(`[Transaction Error] Failed to complete trip ${id}:`, err);
    throw err;
  }
};

const cancelTrip = async (id) => {
  try {
    const trip = await prisma.$transaction(async (tx) => {
      const t = await tx.trip.findUnique({ where: { id } });
      if (!t) throw { status: 404, message: 'Trip not found', code: 'NOT_FOUND' };
      if (t.status !== 'DISPATCHED') throw { status: 400, message: 'Trip must be DISPATCHED to cancel it this way', code: 'INVALID_STATUS' };

      const updatedTrip = await tx.trip.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      await tx.vehicle.update({ where: { id: t.vehicle_id }, data: { status: 'AVAILABLE' } });
      await tx.driver.update({ where: { id: t.driver_id }, data: { status: 'AVAILABLE' } });

      return updatedTrip;
    });
    return trip;
  } catch (err) {
    console.error(`[Transaction Error] Failed to cancel trip ${id}:`, err);
    throw err;
  }
};

const getTrips = async (query) => {
  const { status, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [trips, total] = await Promise.all([
    prisma.trip.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { created_at: 'desc' }
    }),
    prisma.trip.count({ where: filter })
  ]);

  return {
    data: trips,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take)
    }
  };
};

module.exports = {
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  getTrips
};
