const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Clear DB
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const password = await bcrypt.hash('password123', 10);
  
  const fleetManager = await prisma.user.create({
    data: { name: 'Alice Manager', email: 'alice@transitops.com', password_hash: password, role: 'FLEET_MANAGER' }
  });
  
  const driverUser = await prisma.user.create({
    data: { name: 'Alex DriverUser', email: 'alex@transitops.com', password_hash: password, role: 'DRIVER' }
  });

  await prisma.user.create({
    data: { name: 'Sam Safety', email: 'sam@transitops.com', password_hash: password, role: 'SAFETY_OFFICER' }
  });

  const analyst = await prisma.user.create({
    data: { name: 'Fiona Finance', email: 'fiona@transitops.com', password_hash: password, role: 'FINANCIAL_ANALYST' }
  });

  console.log('Users created.');

  // Create Vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      registration_number: 'Van-05',
      name: 'Delivery Van 05',
      type: 'Van',
      max_load_capacity: 500,
      acquisition_cost: 25000,
      region: 'North',
      status: 'AVAILABLE'
    }
  });

  console.log('Vehicle created:', vehicle.registration_number);

  // Create Driver
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 365); // valid for a year
  
  const driver = await prisma.driver.create({
    data: {
      name: 'Alex',
      license_number: 'DL-123456789',
      license_category: 'B',
      license_expiry_date: tomorrow,
      contact_number: '123-456-7890',
      status: 'AVAILABLE'
    }
  });

  console.log('Driver created:', driver.name);

  console.log('\n--- Demo Workflow Setup ---');
  console.log(`Login as Fleet Manager: alice@transitops.com / password123`);
  console.log(`Vehicle ID: ${vehicle.id} (Max Load: ${vehicle.max_load_capacity}kg)`);
  console.log(`Driver ID: ${driver.id}`);
  console.log(`Ready to create a 450kg trip, dispatch, complete, and send to maintenance.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
