import MaintenanceLog from '../models/MaintenanceLog.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getMaintenanceLogs = asyncHandler(async (req, res) => {
  const { search, type, status, mechanic } = req.query;
  const filter = {};

  if (type && type !== 'All') filter.type = type;
  if (status && status !== 'All') filter.status = status;
  if (mechanic && mechanic !== 'All') filter.mechanic = mechanic;
  if (search) filter.vehicleId = { $regex: search, $options: 'i' };

  const logs = await MaintenanceLog.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: logs });
});

export const getMaintenanceLogById = asyncHandler(async (req, res) => {
  const log = await MaintenanceLog.findById(req.params.id);
  if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found' });
  res.json({ success: true, data: log });
});

export const createMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await MaintenanceLog.create(req.body);
  res.status(201).json({ success: true, data: log });
});

export const updateMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found' });
  res.json({ success: true, data: log });
});

export const deleteMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await MaintenanceLog.findByIdAndDelete(req.params.id);
  if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found' });
  res.json({ success: true, message: 'Maintenance log deleted' });
});

export const completeMaintenanceLog = asyncHandler(async (req, res) => {
  const log = await MaintenanceLog.findByIdAndUpdate(
    req.params.id,
    { status: 'Completed' },
    { new: true }
  );
  if (!log) return res.status(404).json({ success: false, message: 'Maintenance log not found' });
  res.json({ success: true, data: log });
});

export const getMaintenanceStats = asyncHandler(async (req, res) => {
  const [inShop, scheduled, completed, costAgg] = await Promise.all([
    MaintenanceLog.countDocuments({ status: 'In Shop' }),
    MaintenanceLog.countDocuments({ status: 'Scheduled' }),
    MaintenanceLog.countDocuments({ status: 'Completed' }),
    MaintenanceLog.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' } } }]),
  ]);
  const totalCost = costAgg[0]?.totalCost || 0;
  res.json({ success: true, data: { inShop, scheduled, completed, totalCost } });
});
