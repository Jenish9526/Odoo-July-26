import Trip from '../models/Trip.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getTrips = asyncHandler(async (req, res) => {
  const { type, status, region } = req.query;
  const filter = {};

  if (type && type !== 'All') filter.type = type;
  if (status && status !== 'All') filter.status = status;
  if (region && region !== 'All') filter.region = region;

  const trips = await Trip.find(filter)
    .populate('vehicle', 'vehicleName registrationNumber')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: trips });
});

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('vehicle', 'vehicleName registrationNumber');
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, data: trip });
});

export const createTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.create(req.body);
  await trip.populate('vehicle', 'vehicleName registrationNumber');
  res.status(201).json({ success: true, data: trip });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('vehicle', 'vehicleName registrationNumber');
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, data: trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, message: 'Trip deleted' });
});

export const getTripStats = asyncHandler(async (req, res) => {
  const [total, inProgress, completed, delayed, scheduled] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'In Progress' }),
    Trip.countDocuments({ status: 'Completed' }),
    Trip.countDocuments({ status: 'Delayed' }),
    Trip.countDocuments({ status: 'Scheduled' }),
  ]);
  res.json({ success: true, data: { total, inProgress, completed, delayed, scheduled } });
});

// Weekly trip volume for the area chart (last 7 days grouped by day-of-week)
export const getWeeklyTripVolume = asyncHandler(async (req, res) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const result = await Trip.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
  ]);

  // $dayOfWeek: 1=Sun … 7=Sat
  const map = Object.fromEntries(result.map((r) => [r._id, r.count]));
  const data = days.map((label, i) => ({ label, count: map[i + 1] || 0 }));

  res.json({ success: true, data });
});
