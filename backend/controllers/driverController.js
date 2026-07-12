import Driver from '../models/Driver.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getDrivers = asyncHandler(async (req, res) => {
  const { search, category, status } = req.query;
  const filter = {};

  if (category && category !== 'All') filter.licenseCategory = category;
  if (status && status !== 'All') filter.status = status;
  if (search) {
    filter.$or = [
      { driverName: { $regex: search, $options: 'i' } },
      { licenseNumber: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const drivers = await Driver.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: drivers });
});

export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
  res.json({ success: true, data: driver });
});

export const createDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.create(req.body);
  res.status(201).json({ success: true, data: driver });
});

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
  res.json({ success: true, data: driver });
});

export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
  res.json({ success: true, message: 'Driver deleted' });
});

export const getDriverStats = asyncHandler(async (req, res) => {
  const [total, available, onTrip, suspended] = await Promise.all([
    Driver.countDocuments(),
    Driver.countDocuments({ status: 'Available' }),
    Driver.countDocuments({ status: 'On Trip' }),
    Driver.countDocuments({ status: 'Suspended' }),
  ]);
  res.json({ success: true, data: { total, available, onTrip, suspended } });
});
