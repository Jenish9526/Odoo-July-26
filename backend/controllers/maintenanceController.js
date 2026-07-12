import Maintenance from '../models/Maintenance.js';

// GET /api/maintenance
export const getAllLogs = async (req, res, next) => {
    try {
        const { search, type, status, mechanic, page = 1, limit = 50 } = req.query;
        const filter = {};

        if (search) filter.vehicleId = { $regex: search, $options: 'i' };
        if (type && type !== 'All') filter.type = type;
        if (status && status !== 'All') filter.status = status;
        if (mechanic && mechanic !== 'All') filter.mechanic = mechanic;

        const total = await Maintenance.countDocuments(filter);
        const logs = await Maintenance.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ success: true, data: logs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/maintenance/stats
export const getMaintenanceStats = async (req, res, next) => {
    try {
        const total = await Maintenance.countDocuments();
        const inShop = await Maintenance.countDocuments({ status: 'In Shop' });
        const scheduled = await Maintenance.countDocuments({ status: 'Scheduled' });
        const completed = await Maintenance.countDocuments({ status: 'Completed' });
        const delayed = await Maintenance.countDocuments({ status: 'Delayed' });

        const costAgg = await Maintenance.aggregate([{ $group: { _id: null, totalCost: { $sum: '$cost' } } }]);
        const totalCost = costAgg.length > 0 ? costAgg[0].totalCost : 0;

        res.json({ success: true, stats: { total, inShop, scheduled, completed, delayed, totalCost } });
    } catch (err) {
        next(err);
    }
};

// GET /api/maintenance/:id
export const getLogById = async (req, res, next) => {
    try {
        const log = await Maintenance.findById(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
        res.json({ success: true, data: log });
    } catch (err) {
        next(err);
    }
};

// POST /api/maintenance
export const createLog = async (req, res, next) => {
    try {
        const log = await Maintenance.create(req.body);
        res.status(201).json({ success: true, data: log, message: 'Maintenance log created' });
    } catch (err) {
        next(err);
    }
};

// PUT /api/maintenance/:id
export const updateLog = async (req, res, next) => {
    try {
        const log = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
        res.json({ success: true, data: log, message: 'Maintenance log updated' });
    } catch (err) {
        next(err);
    }
};

// PUT /api/maintenance/:id/complete
export const completeLog = async (req, res, next) => {
    try {
        const log = await Maintenance.findByIdAndUpdate(req.params.id, { status: 'Completed' }, { new: true });
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
        res.json({ success: true, data: log, message: 'Maintenance completed' });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/maintenance/:id
export const deleteLog = async (req, res, next) => {
    try {
        const log = await Maintenance.findByIdAndDelete(req.params.id);
        if (!log) return res.status(404).json({ success: false, message: 'Maintenance record not found' });
        res.json({ success: true, message: 'Maintenance record deleted' });
    } catch (err) {
        next(err);
    }
};
