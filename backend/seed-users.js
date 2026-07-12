const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password_hash = await bcrypt.hash('password123', 10);
  
  await prisma.user.upsert({ 
    where: { email: 'manager@transitops.com' }, 
    update: { password_hash, role: 'FLEET_MANAGER' }, 
    create: { name: 'Marcus', email: 'manager@transitops.com', password_hash, role: 'FLEET_MANAGER' } 
  });
  
  await prisma.user.upsert({ 
    where: { email: 'driver@transitops.com' }, 
    update: { password_hash, role: 'DRIVER' }, 
    create: { name: 'Alex', email: 'driver@transitops.com', password_hash, role: 'DRIVER' } 
  });
  
  await prisma.user.upsert({ 
    where: { email: 'safety@transitops.com' }, 
    update: { password_hash, role: 'SAFETY_OFFICER' }, 
    create: { name: 'Sarah', email: 'safety@transitops.com', password_hash, role: 'SAFETY_OFFICER' } 
  });
  
  await prisma.user.upsert({ 
    where: { email: 'finance@transitops.com' }, 
    update: { password_hash, role: 'FINANCIAL_ANALYST' }, 
    create: { name: 'Elena', email: 'finance@transitops.com', password_hash, role: 'FINANCIAL_ANALYST' } 
  });
  
  console.log('Demo users correctly seeded to the database.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
