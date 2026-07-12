const prisma = require('../../prisma');

const getDashboardKPIs = async () => {
  const [
    total_vehicles,
    available_vehicles,
    vehicles_in_maintenance,
    active_vehicles,
    active_trips,
    pending_trips,
    drivers_duty_count
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: { not: 'RETIRED' } } }),
    prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
    prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
    prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
    prisma.trip.count({ where: { status: 'DISPATCHED' } }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
    prisma.driver.count({ where: { status: { in: ['AVAILABLE', 'ON_TRIP'] } } })
  ]);

  const fleet_utilization_percent = total_vehicles === 0 ? 0 : (active_vehicles / total_vehicles) * 100;

  return {
    active_vehicles,
    available_vehicles,
    vehicles_in_maintenance,
    active_trips,
    pending_trips,
    drivers_on_duty: drivers_duty_count,
    fleet_utilization_percent,
  };
};

const getFuelEfficiencyReport = async () => {
  // Using groupBy to avoid in-memory loops and fetch only what's needed
  const groupedTrips = await prisma.trip.groupBy({
    by: ['vehicle_id'],
    _sum: { planned_distance: true, fuel_consumed: true },
    where: { status: 'COMPLETED', fuel_consumed: { gt: 0 } }
  });

  // Fetch vehicle names separately since Prisma groupBy doesn't support relation fields directly
  const vehicleIds = groupedTrips.map(g => g.vehicle_id);
  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: vehicleIds } },
    select: { id: true, name: true }
  });
  
  const vehicleMap = vehicles.reduce((acc, v) => {
    acc[v.id] = v.name;
    return acc;
  }, {});

  const efficiency = groupedTrips.map(g => {
    const distance = g._sum.planned_distance || 0;
    const fuel = g._sum.fuel_consumed || 0;
    return {
      vehicle_id: g.vehicle_id,
      vehicle_name: vehicleMap[g.vehicle_id] || 'Unknown',
      distance,
      fuel,
      efficiency: fuel === 0 ? 0 : distance / fuel
    };
  });

  return efficiency;
};

const getFleetUtilization = async () => {
  const total = await prisma.vehicle.count();
  const statuses = await prisma.vehicle.groupBy({
    by: ['status'],
    _count: { status: true }
  });
  return { total, statuses };
};

const getOperationalCost = async () => {
  const [fuel, maintenance, expenses] = await Promise.all([
    prisma.fuelLog.aggregate({ _sum: { cost: true } }),
    prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } })
  ]);
  
  const total_fuel = fuel._sum.cost || 0;
  const total_maintenance = maintenance._sum.cost || 0;
  const total_expenses = expenses._sum.amount || 0;

  return {
    total_fuel,
    total_maintenance,
    total_expenses,
    grand_total: total_fuel + total_maintenance + total_expenses
  };
};

const getVehicleROI = async () => {
  // Using select to fetch only required fields, preventing full row fetch and memory bloat
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      name: true,
      acquisition_cost: true,
      trips: {
        where: { status: 'COMPLETED' },
        select: { revenue: true }
      },
      maintenanceLogs: {
        select: { cost: true }
      },
      fuelLogs: {
        select: { cost: true }
      }
    }
  });

  const result = vehicles.map(v => {
    const revenue = v.trips.reduce((acc, t) => acc + (t.revenue || 0), 0);
    const maintenance = v.maintenanceLogs.reduce((acc, m) => acc + (m.cost || 0), 0);
    const fuel = v.fuelLogs.reduce((acc, f) => acc + (f.cost || 0), 0);
    
    const roi = v.acquisition_cost === 0 ? 0 : (revenue - (maintenance + fuel)) / v.acquisition_cost;
    
    return { 
      vehicle_id: v.id, 
      vehicle_name: v.name, 
      roi, 
      revenue, 
      maintenance, 
      fuel, 
      acquisition_cost: v.acquisition_cost 
    };
  });

  return result;
};

const getExportData = async (type) => {
  let data = [];
  if (type === 'vehicles') {
    data = await prisma.vehicle.findMany();
  } else if (type === 'trips') {
    data = await prisma.trip.findMany();
  } else if (type === 'fuel') {
    data = await prisma.fuelLog.findMany();
  } else if (type === 'expenses') {
    data = await prisma.expense.findMany();
  } else {
    const error = new Error('Invalid type');
    error.status = 400;
    error.code = 'INVALID_TYPE';
    throw error;
  }
  return data;
};

module.exports = {
  getDashboardKPIs,
  getFuelEfficiencyReport,
  getFleetUtilization,
  getOperationalCost,
  getVehicleROI,
  getExportData
};
