const prisma = require('../../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../middleware/auth');

const registerUser = async (data) => {
  const { name, email, password, role } = data;
  
  // Checking existing user is somewhat redundant because of Prisma P2002 error handler,
  // but it's fine to keep it explicit for better error handling flow if needed.
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    const error = new Error('Email already exists');
    error.status = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 10);
  
  const user = await prisma.user.create({
    data: { name, email, password_hash, role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true
    }
  });

  return user;
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    const error = new Error('Invalid credentials');
    error.status = 401;
    error.code = 'UNAUTHORIZED';
    throw error;
  }

  // Token expires in 8 hours. 
  // TODO: Consider implementing a refresh token mechanism for long-lived sessions.
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  
  return { 
    token, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role } 
  };
};

module.exports = { registerUser, loginUser };
