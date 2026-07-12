import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import Driver from '../models/Driver.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import asyncHandler from '../middleware/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalVehicles,
    availableVehicles,
    inShopVehicles,
    onTripVehicles,
    retiredVehicles,
    activeTrips,
    pendingTrips,
    totalTrips,
    driversOnDuty,
    totalDrivers,
    maintCostAgg,
    fuelCostAgg,
    expenseCostAgg,
  ] = await Promise.all([
    Vehicle.countDocuments(),
    Vehicle.countDocuments({ status: 'Available' }),
    Vehicle.countDocuments({ status: 'In Shop' }),
    Vehicle.countDocuments({ status: 'On Trip' }),
    Vehicle.countDocuments({ status: 'Retired' }),
    Trip.countDocuments({ status: 'Dispatched' }),
    Trip.countDocuments({ status: 'Draft' }),
    Trip.countDocuments(),
    Driver.countDocuments({ status: 'On Trip' }),
    Driver.countDocuments(),
    MaintenanceLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]),
    FuelLog.aggregate([{ $group: { _id: null, total: { $sum: '$cost' } } }]),
    Expense.aggregate([{ $group: { _id: null, toll: { $sum: '$toll' }, other: { $sum: '$other' }, maint: { $sum: '$maint' } } }]),
  ]);

  const utilization = totalVehicles > 0
    ? parseFloat(((onTripVehicles / totalVehicles) * 100).toFixed(1))
    : 0;

  const maintCost = maintCostAgg[0]?.total || 0;
  const fuelCost  = fuelCostAgg[0]?.total || 0;
  const expCost   = expenseCostAgg[0] ? expenseCostAgg[0].toll + expenseCostAgg[0].other + expenseCostAgg[0].maint : 0;

  res.json({
    success: true,
    data: {
      vehicles: { total: totalVehicles, available: availableVehicles, inShop: inShopVehicles, onTrip: onTripVehicles, retired: retiredVehicles },
      trips: { active: activeTrips, pending: pendingTrips, total: totalTrips },
      drivers: { onDuty: driversOnDuty, total: totalDrivers },
      utilization,
      costs: { maintenance: maintCost, fuel: fuelCost, expenses: expCost, total: maintCost + fuelCost + expCost },
    },
  });
});

// Recent trips for the dashboard table
export const getRecentTrips = asyncHandler(async (req, res) => {
  const { type, status, region } = req.query;
  const filter = {};
  if (type && type !== 'All') filter.type = type;
  if (status && status !== 'All') filter.status = status;
  if (region && region !== 'All') filter.region = region;

  const trips = await Trip.find(filter).sort({ createdAt: -1 }).limit(10);
  res.json({ success: true, data: trips });
});
