const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma');

describe('Maintenance Status Transitions', () => {
  let server;
  let token;
  let vehicle;

  beforeAll(async () => {
    server = app.listen(0);
    
    const testUser = await prisma.user.create({
      data: { name: 'Maint Tester', email: `maint_${Date.now()}@test.com`, password_hash: 'hash', role: 'FLEET_MANAGER' }
    });
    
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../src/middleware/auth');
    token = jwt.sign({ userId: testUser.id, role: testUser.role }, JWT_SECRET);

    vehicle = await prisma.vehicle.create({
      data: { registration_number: `MN-${Date.now()}`, name: 'Maint Van', type: 'Van', max_load_capacity: 400, acquisition_cost: 10000, region: 'Test', status: 'AVAILABLE' }
    });
  });

  afterAll(async () => {
    await prisma.maintenanceLog.deleteMany({ where: { vehicle_id: vehicle.id } });
    await prisma.vehicle.delete({ where: { id: vehicle.id } });
    await prisma.user.deleteMany({ where: { email: { startsWith: 'maint_' } } });
    await server.close();
  });

  it('should change vehicle status to IN_SHOP when maintenance is created', async () => {
    const res = await request(app).post('/maintenance')
      .set('Authorization', `Bearer ${token}`)
      .send({
        vehicle_id: vehicle.id,
        description: 'Oil change',
        cost: 100
      });
    
    expect(res.statusCode).toBe(201);
    
    const v = await prisma.vehicle.findUnique({ where: { id: vehicle.id } });
    expect(v.status).toBe('IN_SHOP');
  });
});
