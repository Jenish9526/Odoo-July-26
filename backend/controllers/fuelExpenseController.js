import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';

// ═══════════════════ FUEL LOGS ═══════════════════

// GET /api/fuel
export const getAllFuelLogs = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (search) filter.vehicleId = { $regex: search, $options: 'i' };

        const total = await FuelLog.countDocuments(filter);
        const logs = await FuelLog.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));

        res.json({ success: true, data: logs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

// POST /api/fuel
export const createFuelLog = async (req, res, next) => {
    try {
        const log = await FuelLog.create(req.body);
        res.status(201).json({ success: true, data: log, message: 'Fuel log created' });
    } catch (err) { next(err); }
};

// PUT /api/fuel/:id
export const updateFuelLog = async (req, res, next) => {
    try {
        const log = await FuelLog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found' });
        res.json({ success: true, data: log, message: 'Fuel log updated' });
    } catch (err) { next(err); }
};

// DELETE /api/fuel/:id
export const deleteFuelLog = async (req, res, next) => {
    try {
        const log = await FuelLog.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Fuel log not found' });
        res.json({ success: true, message: 'Fuel log deleted' });
    } catch (err) { next(err); }
};

// ═══════════════════ EXPENSES ═══════════════════

// GET /api/expenses
export const getAllExpenses = async (req, res, next) => {
    try {
        const { search, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (search) filter.vehicleId = { $regex: search, $options: 'i' };

        const total = await Expense.countDocuments(filter);
        const expenses = await Expense.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));

        res.json({ success: true, data: expenses, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) { next(err); }
};

// POST /api/expenses
export const createExpense = async (req, res, next) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({ success: true, data: expense, message: 'Expense logged' });
    } catch (err) { next(err); }
};

// PUT /api/expenses/:id
export const updateExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
        res.json({ success: true, data: expense, message: 'Expense updated' });
    } catch (err) { next(err); }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
        res.json({ success: true, message: 'Expense deleted' });
    } catch (err) { next(err); }
};

// ═══════════════════ COMBINED STATS ═══════════════════

// GET /api/fuel/stats
export const getFuelExpenseStats = async (req, res, next) => {
    try {
        const fuelAgg = await FuelLog.aggregate([{ $group: { _id: null, totalFuelCost: { $sum: '$cost' }, totalLiters: { $sum: '$liters' } } }]);
        const expAgg = await Expense.aggregate([{ $group: { _id: null, totalToll: { $sum: '$toll' }, totalOther: { $sum: '$other' }, totalMaint: { $sum: '$maint' } } }]);

        const totalFuelCost = fuelAgg.length > 0 ? fuelAgg[0].totalFuelCost : 0;
        const totalLiters = fuelAgg.length > 0 ? fuelAgg[0].totalLiters : 0;
        const totalToll = expAgg.length > 0 ? expAgg[0].totalToll : 0;
        const totalOther = expAgg.length > 0 ? expAgg[0].totalOther : 0;
        const totalMaint = expAgg.length > 0 ? expAgg[0].totalMaint : 0;
        const totalOperationalCost = totalFuelCost + totalToll + totalOther + totalMaint;

        res.json({
            success: true,
            stats: { totalFuelCost, totalLiters, totalToll, totalOther, totalMaint, totalOperationalCost },
        });
    } catch (err) { next(err); }
};
