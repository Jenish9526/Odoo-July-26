import Trip from '../models/Trip.js';

export const getTrips = async (req, res) => {
  const { type, status, region } = req.query;
  const filter = {};

  if (type && type !== 'All') filter.type = type;
  if (status && status !== 'All') filter.status = status;
  if (region && region !== 'All') filter.region = region;

  const trips = await Trip.find(filter).populate('vehicle', 'vehicleName registrationNumber').sort({ createdAt: -1 });
  res.json({ success: true, data: trips });
};

export const getTripById = async (req, res) => {
  const trip = await Trip.findById(req.params.id).populate('vehicle', 'vehicleName registrationNumber');
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, data: trip });
};

export const createTrip = async (req, res) => {
  const trip = await Trip.create(req.body);
  await trip.populate('vehicle', 'vehicleName registrationNumber');
  res.status(201).json({ success: true, data: trip });
};

export const updateTrip = async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('vehicle', 'vehicleName registrationNumber');
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, data: trip });
};

export const deleteTrip = async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  res.json({ success: true, message: 'Trip deleted' });
};

export const getTripStats = async (req, res) => {
  const [total, inProgress, completed, delayed, scheduled] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'In Progress' }),
    Trip.countDocuments({ status: 'Completed' }),
    Trip.countDocuments({ status: 'Delayed' }),
    Trip.countDocuments({ status: 'Scheduled' }),
  ]);
  res.json({ success: true, data: { total, inProgress, completed, delayed, scheduled } });
};
