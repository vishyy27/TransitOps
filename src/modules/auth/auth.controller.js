const authService = require('./auth.service');

const register = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  res.json({ success: true, data: result });
};

module.exports = { register, login };
