const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/prisma');

describe('Auth Flow', () => {
  let server;
  let testUserEmail = `test_${Date.now()}@transitops.com`;

  beforeAll(async () => {
    server = app.listen(0);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: testUserEmail } });
    await server.close();
  });

  it('should fail to register with weak password', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: testUserEmail,
      password: 'weak',
      role: 'FLEET_MANAGER'
    });
    
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('Password must be at least 8 characters long');
  });

  it('should register a new user successfully', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: testUserEmail,
      password: 'StrongPassword1!',
      role: 'FLEET_MANAGER'
    });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.email).toBe(testUserEmail);
  });

  it('should login successfully and return a token', async () => {
    const res = await request(app).post('/auth/login').send({
      email: testUserEmail,
      password: 'StrongPassword1!'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });
});
