import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import asyncHandler from '../middleware/asyncHandler.js';

// ── Fuel Logs ──────────────────────────────────────────────────────────────

export const getFuelLogs = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { vehicleId: { $regex: search, $options: 'i' } }
    : {};
  const logs = await FuelLog.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: logs });
});

export const createFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.create(req.body);
  res.status(201).json({ success: true, data: log });
});

export const updateFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found' });
  res.json({ success: true, data: log });
});

export const deleteFuelLog = asyncHandler(async (req, res) => {
  const log = await FuelLog.findByIdAndDelete(req.params.id);
  if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found' });
  res.json({ success: true, message: 'Fuel log deleted' });
});

// ── Expenses ───────────────────────────────────────────────────────────────

export const getExpenses = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? { vehicleId: { $regex: search, $options: 'i' } }
    : {};
  const expenses = await Expense.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, data: expenses });
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json({ success: true, data: expense });
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  res.json({ success: true, data: expense });
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
  res.json({ success: true, message: 'Expense deleted' });
});

// ── Summary totals ─────────────────────────────────────────────────────────

export const getFuelExpenseSummary = asyncHandler(async (req, res) => {
  const [fuelAgg, expenseAgg] = await Promise.all([
    FuelLog.aggregate([{ $group: { _id: null, totalFuelCost: { $sum: '$cost' }, totalLiters: { $sum: '$liters' } } }]),
    Expense.aggregate([{ $group: { _id: null, totalToll: { $sum: '$toll' }, totalOther: { $sum: '$other' }, totalMaint: { $sum: '$maint' } } }]),
  ]);

  const fuel = fuelAgg[0] || { totalFuelCost: 0, totalLiters: 0 };
  const exp  = expenseAgg[0] || { totalToll: 0, totalOther: 0, totalMaint: 0 };
  const totalOperationalCost = fuel.totalFuelCost + exp.totalToll + exp.totalOther + exp.totalMaint;

  res.json({
    success: true,
    data: {
      totalFuelCost: fuel.totalFuelCost,
      totalLiters: fuel.totalLiters,
      totalToll: exp.totalToll,
      totalOther: exp.totalOther,
      totalMaint: exp.totalMaint,
      totalOperationalCost,
    },
  });
});
