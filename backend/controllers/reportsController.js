import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';

// GET /api/reports
export const getReportsData = async (req, res, next) => {
    try {
        const { search, region, type, status, page = 1, limit = 50 } = req.query;

        // ── Vehicle Performance Matrix ──
        const vehicleFilter = {};
        if (search) vehicleFilter.vehicleName = { $regex: search, $options: 'i' };
        if (type && type !== 'All') vehicleFilter.type = type;
        if (status && status !== 'All') vehicleFilter.status = status;

        const vehicles = await Vehicle.find(vehicleFilter).sort({ createdAt: -1 });

        // Aggregate trips per vehicle
        const tripCountByVehicle = await Trip.aggregate([
            { $group: { _id: '$vehicleId', tripCount: { $sum: 1 } } },
        ]);
        const tripMap = {};
        tripCountByVehicle.forEach(t => { tripMap[t._id] = t.tripCount; });

        // Aggregate maintenance cost per vehicle
        const maintByVehicle = await Maintenance.aggregate([
            { $group: { _id: '$vehicleId', cost: { $sum: '$cost' } } },
        ]);
        const maintMap = {};
        maintByVehicle.forEach(m => { maintMap[m._id] = m.cost; });

        // Aggregate fuel per vehicle
        const fuelByVehicle = await FuelLog.aggregate([
            { $group: { _id: '$vehicleId', totalLiters: { $sum: '$liters' }, totalCost: { $sum: '$cost' } } },
        ]);
        const fuelMap = {};
        fuelByVehicle.forEach(f => { fuelMap[f._id] = f; });

        // Build vehicle analytics
        const vehicleAnalytics = vehicles.map(v => {
            const regNum = v.registrationNumber;
            const trips = tripMap[regNum] || tripMap[v.vehicleName] || 0;
            const fuel = fuelMap[regNum]?.totalLiters || fuelMap[v.vehicleName]?.totalLiters || 0;
            const maint = maintMap[regNum] || maintMap[v.vehicleName] || 0;
            const revenue = trips * 650; // Estimated revenue per trip
            const fuelCost = fuel * 3.5;
            const opCost = fuelCost + maint;
            const roi = v.acquisitionCost > 0 ? (((revenue - opCost) / v.acquisitionCost) * 100).toFixed(1) : '0.0';
            const efficiency = fuel > 0 ? ((trips * 12.4) / (fuel / 45)).toFixed(1) : '0.0';

            return {
                id: v._id,
                name: v.vehicleName,
                registrationNumber: v.registrationNumber,
                type: v.type,
                region: 'North', // default region
                trips,
                fuel,
                maint,
                revenue,
                acquisition: v.acquisitionCost,
                status: v.status === 'In Shop' ? 'In Shop' : 'Active',
                opCost,
                roi,
                efficiency,
            };
        });

        const total = vehicleAnalytics.length;
        const paginated = vehicleAnalytics.slice((page - 1) * limit, page * limit);

        // ── KPI Summaries ──
        const totalFuelAgg = await FuelLog.aggregate([{ $group: { _id: null, cost: { $sum: '$cost' }, liters: { $sum: '$liters' } } }]);
        const totalMaintAgg = await Maintenance.aggregate([{ $group: { _id: null, cost: { $sum: '$cost' } } }]);
        const totalExpAgg = await Expense.aggregate([{ $group: { _id: null, toll: { $sum: '$toll' }, other: { $sum: '$other' }, maint: { $sum: '$maint' } } }]);

        const totalFuelCost = totalFuelAgg.length > 0 ? totalFuelAgg[0].cost : 0;
        const totalMaintCost = totalMaintAgg.length > 0 ? totalMaintAgg[0].cost : 0;
        const operationalCost = totalFuelCost + totalMaintCost;

        const vehicleCount = await Vehicle.countDocuments();
        const availableCount = await Vehicle.countDocuments({ status: 'Available' });
        const utilization = vehicleCount > 0 ? Math.round(((vehicleCount - availableCount) / vehicleCount) * 100) : 0;

        // ── Top costliest vehicles (maintenance) ──
        const topCostliest = await Maintenance.aggregate([
            { $group: { _id: '$vehicleId', Maintenance: { $sum: '$cost' } } },
            { $sort: { Maintenance: -1 } },
            { $limit: 5 },
            { $project: { name: '$_id', Maintenance: 1, Fuel: { $literal: 0 }, _id: 0 } },
        ]);

        res.json({
            success: true,
            reports: {
                kpi: {
                    fuelEfficiency: '8.4 km/L',
                    utilization: `${utilization}%`,
                    operationalCost,
                    vehicleROI: '14.2%',
                },
                vehicleAnalytics: paginated,
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limit),
                charts: {
                    topCostliest,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};
