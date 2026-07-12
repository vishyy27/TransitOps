const express = require('express');
const rateLimit = require('express-rate-limit');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');
const authController = require('./auth.controller');
const asyncHandler = require('../../utils/asyncHandler');
const passport = require('passport');

const router = express.Router();

// Limit auth attempts to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many auth attempts from this IP, please try again after 15 minutes',
      field: null
    }
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(authController.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));

// Google OAuth Routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

  router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }), 
    asyncHandler(authController.googleCallback)
  );
}

module.exports = router;
