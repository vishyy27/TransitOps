const authService = require('./auth.service');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json({ success: true, data: result });
};

const googleCallback = async (req, res) => {
  // req.user contains the user from passport strategy
  const user = req.user;
  
  // Issue JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role }, 
    process.env.JWT_SECRET || 'supersecret_jwt_key_here', 
    { expiresIn: '8h' }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        auth_provider: user.auth_provider
      }
    }
  });
};

module.exports = { register, login, googleCallback };
