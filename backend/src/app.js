const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const errorHandler = require('./middleware/errorHandler');

// Import Routes
const authRoutes = require('./modules/auth/auth.routes');
const vehiclesRoutes = require('./modules/vehicles/vehicles.routes');
const driversRoutes = require('./modules/drivers/drivers.routes');
const tripsRoutes = require('./modules/trips/trips.routes');
const maintenanceRoutes = require('./modules/maintenance/maintenance.routes');
const fuelExpensesRoutes = require('./modules/fuel-expenses/fuelExpenses.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

require('./modules/auth/google-strategy');
app.use(passport.initialize());

// Parsers & Logging
app.use(express.json());
app.use(morgan('dev')); // Structured request logger

// Routes Registration
app.use('/auth', authRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/drivers', driversRoutes);
app.use('/trips', tripsRoutes);
app.use('/maintenance', maintenanceRoutes);
// Root level routes from fuelExpenses and dashboard as they don't have a single prefix in requirements
app.use('/', fuelExpensesRoutes);
app.use('/', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
