const tripsService = require('./trips.service');

const createTrip = async (req, res) => {
  const trip = await tripsService.createTrip(req.body);
  res.status(201).json({ success: true, data: trip });
};

const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await tripsService.dispatchTrip(parseInt(req.params.id));
    res.json({ success: true, data: trip });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

const completeTrip = async (req, res, next) => {
  try {
    const trip = await tripsService.completeTrip(parseInt(req.params.id), req.body);
    res.json({ success: true, data: trip });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

const cancelTrip = async (req, res, next) => {
  try {
    const trip = await tripsService.cancelTrip(parseInt(req.params.id));
    res.json({ success: true, data: trip });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ success: false, error: { code: err.code, message: err.message, field: null } });
    next(err);
  }
};

const getTrips = async (req, res) => {
  const result = await tripsService.getTrips(req.query);
  res.json({ success: true, ...result });
};

module.exports = {
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
  getTrips
};
