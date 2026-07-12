import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';

// GET /api/dashboard
export const getDashboardData = async (req, res, next) => {
    try {
        // ── KPI Counts ──
        const totalVehicles = await Vehicle.countDocuments();
        const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
        const inShopVehicles = await Vehicle.countDocuments({ status: 'In Shop' });
        const retiredVehicles = await Vehicle.countDocuments({ status: 'Retired' });
        const onTripVehicles = await Vehicle.countDocuments({ status: 'On Trip' });

        const activeTrips = await Trip.countDocuments({ status: { $in: ['Dispatched', 'On Trip'] } });
        const pendingTrips = await Trip.countDocuments({ status: { $in: ['Draft', 'Scheduled'] } });

        const driversOnDuty = await Driver.countDocuments({ status: { $in: ['Available', 'On Trip'] } });

        const utilization = totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles - retiredVehicles) / totalVehicles) * 100) : 0;

        // ── Recent Trips ──
        const recentTrips = await Trip.find().sort({ createdAt: -1 }).limit(10);

        // ── Vehicle Status Composition ──
        const vehicleComposition = {
            available: { count: availableVehicles, percent: totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0 },
            onTrip: { count: onTripVehicles, percent: totalVehicles > 0 ? Math.round((onTripVehicles / totalVehicles) * 100) : 0 },
            inShop: { count: inShopVehicles, percent: totalVehicles > 0 ? Math.round((inShopVehicles / totalVehicles) * 100) : 0 },
            retired: { count: retiredVehicles, percent: totalVehicles > 0 ? Math.round((retiredVehicles / totalVehicles) * 100) : 0 },
        };

        // ── Chart Data (Trips by day of week from actual data) ──
        const tripsOverview = await Trip.aggregate([
            { $group: { _id: { $dayOfWeek: '$createdAt' }, count: { $sum: 1 } } },
            { $sort: { '_id': 1 } },
        ]);
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const tripsOverviewData = dayNames.map((name, i) => {
            const match = tripsOverview.find(d => d._id === i + 1);
            return { name, Trips: match ? match.count : 0 };
        });

        // ── Fuel consumption aggregated ──
        const fuelAgg = await FuelLog.aggregate([{ $group: { _id: null, totalLiters: { $sum: '$liters' }, totalCost: { $sum: '$cost' } } }]);
        const fuelStats = fuelAgg.length > 0 ? fuelAgg[0] : { totalLiters: 0, totalCost: 0 };

        // ── Maintenance cost by vehicle ──
        const maintByVehicle = await Maintenance.aggregate([
            { $group: { _id: '$vehicleId', Cost: { $sum: '$cost' } } },
            { $project: { name: '$_id', Cost: 1, _id: 0 } },
            { $sort: { Cost: -1 } },
            { $limit: 5 },
        ]);

        // ── Recent Activities ──
        const recentMaintenance = await Maintenance.find().sort({ createdAt: -1 }).limit(3);
        const recentFuel = await FuelLog.find().sort({ createdAt: -1 }).limit(2);

        res.json({
            success: true,
            dashboard: {
                kpi: {
                    activeVehicles: totalVehicles,
                    availableVehicles,
                    inShopVehicles,
                    activeTrips,
                    pendingTrips,
                    driversOnDuty,
                    utilization,
                },
                recentTrips,
                vehicleComposition,
                charts: {
                    tripsOverview: tripsOverviewData,
                    fuelStats,
                    maintByVehicle,
                },
                recentActivities: {
                    maintenance: recentMaintenance,
                    fuel: recentFuel,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};
