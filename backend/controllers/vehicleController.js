import Vehicle from '../models/Vehicle.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getVehicles = asyncHandler(async (req, res) => {
  const { type, status, search } = req.query;
  const filter = {};

  if (type && type !== 'All') filter.type = type;
  if (status && status !== 'All') filter.status = status;
  if (search) {
    filter.$or = [
      { vehicleName: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
    ];
  }

  const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: vehicles });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, data: vehicle });
});

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.create(req.body);
  res.status(201).json({ success: true, data: vehicle });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, data: vehicle });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, message: 'Vehicle deleted' });
});

export const getVehicleStats = asyncHandler(async (req, res) => {
  const [total, available, onTrip, inShop, retired] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'Available' }),
    Vehicle.countDocuments({ status: 'On Trip' }),
    Vehicle.countDocuments({ status: 'In Shop' }),
    Vehicle.countDocuments({ status: 'Retired' }),
  ]);
  res.json({ success: true, data: { total, available, onTrip, inShop, retired } });
});
