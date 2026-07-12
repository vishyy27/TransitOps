const prisma = require('../../prisma');

const formatDriverWithExpiry = (driver) => {
  return {
    ...driver,
    is_license_expired: driver.license_expiry_date < new Date()
  };
};

const createDriver = async (data) => {
  const driver = await prisma.driver.create({
    data: {
      ...data,
      license_expiry_date: new Date(data.license_expiry_date)
    },
  });
  return formatDriverWithExpiry(driver);
};

const getDrivers = async (query) => {
  const { status, page = 1, limit = 10 } = query;
  
  const filter = {};
  if (status) filter.status = status;
  
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [drivers, total] = await Promise.all([
    prisma.driver.findMany({ 
      where: filter,
      skip,
      take,
      orderBy: { created_at: 'desc' }
    }),
    prisma.driver.count({ where: filter })
  ]);

  return {
    data: drivers.map(formatDriverWithExpiry),
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / take)
    }
  };
};

const getDriverById = async (id) => {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) {
    const error = new Error('Driver not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return formatDriverWithExpiry(driver);
};

const updateDriver = async (id, data) => {
  const updateData = { ...data };
  if (updateData.license_expiry_date) {
    updateData.license_expiry_date = new Date(updateData.license_expiry_date);
  }

  const driver = await prisma.driver.update({
    where: { id },
    data: updateData,
  }).catch(() => null);
  
  if (!driver) {
    const error = new Error('Driver not found');
    error.status = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  return formatDriverWithExpiry(driver);
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver
};
