const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');
const authController = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');

const router = express.Router();

// Limit login attempts to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts from this IP, please try again after 15 minutes',
      field: null
    }
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', loginLimiter, validate(loginSchema), asyncHandler(authController.login));

module.exports = router;
