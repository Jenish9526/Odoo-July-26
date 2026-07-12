import Driver from '../models/Driver.js';

// GET /api/drivers
export const getAllDrivers = async (req, res, next) => {
    try {
        const { search, category, status, page = 1, limit = 50 } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { driverName: { $regex: search, $options: 'i' } },
                { licenseNumber: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
            ];
        }
        if (category && category !== 'All') filter.licenseCategory = category;
        if (status && status !== 'All') filter.status = status;

        const total = await Driver.countDocuments(filter);
        const drivers = await Driver.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({ success: true, data: drivers, total, page: Number(page), totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/drivers/stats
export const getDriverStats = async (req, res, next) => {
    try {
        const total = await Driver.countDocuments();
        const available = await Driver.countDocuments({ status: 'Available' });
        const onTrip = await Driver.countDocuments({ status: 'On Trip' });
        const offDuty = await Driver.countDocuments({ status: 'Off Duty' });
        const suspended = await Driver.countDocuments({ status: 'Suspended' });

        res.json({ success: true, stats: { total, available, onTrip, offDuty, suspended } });
    } catch (err) {
        next(err);
    }
};

// GET /api/drivers/:id
export const getDriverById = async (req, res, next) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, data: driver });
    } catch (err) {
        next(err);
    }
};

// POST /api/drivers
export const createDriver = async (req, res, next) => {
    try {
        const driver = await Driver.create(req.body);
        res.status(201).json({ success: true, data: driver, message: 'Driver registered successfully' });
    } catch (err) {
        next(err);
    }
};

// PUT /api/drivers/:id
export const updateDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, data: driver, message: 'Driver updated successfully' });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/drivers/:id
export const deleteDriver = async (req, res, next) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        if (!driver) return res.status(404).json({ success: false, message: 'Driver not found' });
        res.json({ success: true, message: 'Driver deleted successfully' });
    } catch (err) {
        next(err);
    }
};
