/*  ══════════════════════════════════════════════════════════════
    TransitOps — Database Seed Script
    Run:  node scripts/seed.js
    Seeds all collections with realistic demo data matching the
    frontend mock data exactly.
    ══════════════════════════════════════════════════════════════ */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ── Models ──
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import Settings from '../models/Settings.js';
import Role from '../models/Role.js';

const MONGO_URI = process.env.DATABASE_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/TransitOps';

// ─────────────────────── SEED DATA ───────────────────────

const users = [
    { email: 'admin@transitops.com', password: 'TransitOps@2026', role: 'Administrator', name: 'Admin User' },
    { email: 'dispatcher@transitops.com', password: 'Dispatch@123', role: 'Dispatcher', name: 'Jane Dispatcher' },
    { email: 'demo@transitops.com', password: 'demo@123', role: 'Fleet Manager', name: 'Demo User' },
    { email: 'driver@transitops.com', password: 'Driver@123', role: 'Driver', name: 'John Driver' },
    { email: 'safety@transitops.com', password: 'Safety@123', role: 'Safety Officer', name: 'Sam Safety' },
    { email: 'finance@transitops.com', password: 'Finance@123', role: 'Financial Analyst', name: 'Fiona Finance' },
];

const vehicles = [
    { registrationNumber: 'TRN-4521', vehicleName: 'Volvo Transit Pro', model: 'Volvo FH16', type: 'Truck', capacity: '18 Ton', odometer: 124500, acquisitionCost: 85000, status: 'Available' },
    { registrationNumber: 'TRN-7832', vehicleName: 'Mercedes Sprinter', model: 'Sprinter 316 CDI', type: 'Van', capacity: '3.5 Ton', odometer: 67200, acquisitionCost: 45000, status: 'On Trip' },
    { registrationNumber: 'TRN-1290', vehicleName: 'Tesla Model S Fleet', model: 'Model S Long Range', type: 'Electric', capacity: '5 Passenger', odometer: 32100, acquisitionCost: 79900, status: 'Available' },
    { registrationNumber: 'TRN-5567', vehicleName: 'Ford E-Transit', model: 'E-Transit 350 HD', type: 'Electric', capacity: '4 Ton', odometer: 15800, acquisitionCost: 52000, status: 'In Shop' },
    { registrationNumber: 'TRN-8901', vehicleName: 'Scania Heavy Hauler', model: 'Scania R500', type: 'Truck', capacity: '24 Ton', odometer: 210300, acquisitionCost: 120000, status: 'On Trip' },
    { registrationNumber: 'TRN-3345', vehicleName: 'Toyota Hilux', model: 'Hilux SR5', type: 'SUV', capacity: '1 Ton', odometer: 89400, acquisitionCost: 38000, status: 'Available' },
    { registrationNumber: 'TRN-6678', vehicleName: 'Chrysler Pacifica', model: 'Pacifica Hybrid', type: 'Minivan', capacity: '7 Passenger', odometer: 45200, acquisitionCost: 42000, status: 'Retired' },
    { registrationNumber: 'TRN-2234', vehicleName: 'Honda Accord Fleet', model: 'Accord Touring', type: 'Sedan', capacity: '5 Passenger', odometer: 78900, acquisitionCost: 33000, status: 'Available' },
    { registrationNumber: 'TRN-9900', vehicleName: 'BYD Electric Bus', model: 'K9M', type: 'Electric', capacity: '40 Passenger', odometer: 56700, acquisitionCost: 750000, status: 'On Trip' },
    { registrationNumber: 'TRN-4410', vehicleName: 'Toyota Camry Hybrid', model: 'Camry XLE Hybrid', type: 'Hybrid', capacity: '5 Passenger', odometer: 34500, acquisitionCost: 35000, status: 'Available' },
];

const drivers = [
    { driverName: 'Michael Carter', licenseNumber: 'CDL-98210', licenseCategory: 'Class A CDL', expiryDate: '2026-11-20', phone: '+1 (555) 201-3456', safetyScore: 92, status: 'Available' },
    { driverName: 'Sarah Mitchell', licenseNumber: 'CDL-45330', licenseCategory: 'Class B CDL', expiryDate: '2025-08-15', phone: '+1 (555) 302-4567', safetyScore: 88, status: 'On Trip' },
    { driverName: 'David Thompson', licenseNumber: 'STD-67890', licenseCategory: 'Standard Passenger', expiryDate: '2026-03-10', phone: '+1 (555) 403-5678', safetyScore: 78, status: 'Off Duty' },
    { driverName: 'Emily Rodriguez', licenseNumber: 'CDL-23140', licenseCategory: 'Class A CDL', expiryDate: '2027-01-25', phone: '+1 (555) 504-6789', safetyScore: 95, status: 'Available' },
    { driverName: 'James Wilson', licenseNumber: 'CDL-78560', licenseCategory: 'Class C', expiryDate: '2025-12-05', phone: '+1 (555) 605-7890', safetyScore: 71, status: 'Suspended' },
    { driverName: 'Lisa Chen', licenseNumber: 'CDL-34500', licenseCategory: 'Class B CDL', expiryDate: '2026-06-18', phone: '+1 (555) 706-8901', safetyScore: 84, status: 'On Trip' },
    { driverName: 'Robert Anderson', licenseNumber: 'STD-11280', licenseCategory: 'Standard Passenger', expiryDate: '2026-09-30', phone: '+1 (555) 807-9012', safetyScore: 90, status: 'Available' },
    { driverName: 'Maria Gonzalez', licenseNumber: 'CDL-56700', licenseCategory: 'Class A CDL', expiryDate: '2027-04-12', phone: '+1 (555) 908-0123', safetyScore: 97, status: 'Available' },
];

const trips = [
    { tripId: 'TR001', source: 'Dallas Hub', destination: 'Houston Depot', vehicleId: 'TRN-4521', driverName: 'Michael Carter', cargoWeight: 14200, plannedDistance: 385, estDuration: 6, departureDate: '2026-01-15', status: 'Completed', eta: 'Done', progress: 100, type: 'Truck', region: 'South' },
    { tripId: 'TR002', source: 'Austin Center', destination: 'San Antonio Port', vehicleId: 'TRN-7832', driverName: 'Sarah Mitchell', cargoWeight: 2800, plannedDistance: 128, estDuration: 2, departureDate: '2026-01-18', status: 'On Trip', eta: '2h 15m', progress: 65, type: 'Van', region: 'South' },
    { tripId: 'TR003', source: 'Denver Warehouse', destination: 'Phoenix Terminal', vehicleId: 'TRN-1290', driverName: 'Emily Rodriguez', cargoWeight: 0, plannedDistance: 602, estDuration: 9, departureDate: '2026-01-20', status: 'Dispatched', eta: '8h 40m', progress: 10, type: 'Electric', region: 'West' },
    { tripId: 'TR004', source: 'Chicago Yard', destination: 'Detroit Facility', vehicleId: 'TRN-8901', driverName: 'Lisa Chen', cargoWeight: 22000, plannedDistance: 283, estDuration: 4.5, departureDate: '2026-01-22', status: 'On Trip', eta: '3h 20m', progress: 42, type: 'Truck', region: 'North' },
    { tripId: 'TR005', source: 'Miami Docks', destination: 'Orlando Center', vehicleId: 'TRN-3345', driverName: 'Robert Anderson', cargoWeight: 900, plannedDistance: 235, estDuration: 3.5, departureDate: '2026-01-25', status: 'Scheduled', eta: 'TBD', progress: 0, type: 'SUV', region: 'East' },
    { tripId: 'TR006', source: 'Seattle Port', destination: 'Portland Hub', vehicleId: 'TRN-2234', driverName: 'David Thompson', cargoWeight: 0, plannedDistance: 174, estDuration: 3, departureDate: '2026-01-28', status: 'Draft', eta: 'TBD', progress: 0, type: 'Sedan', region: 'West' },
    { tripId: 'TR007', source: 'LA Distribution', destination: 'Las Vegas Depot', vehicleId: 'TRN-9900', driverName: 'Maria Gonzalez', cargoWeight: 0, plannedDistance: 270, estDuration: 4, departureDate: '2026-02-01', status: 'On Trip', eta: '1h 45m', progress: 78, type: 'Electric', region: 'West' },
    { tripId: 'TR008', source: 'Boston Terminal', destination: 'New York Hub', vehicleId: 'TRN-4410', driverName: 'Michael Carter', cargoWeight: 0, plannedDistance: 215, estDuration: 4, departureDate: '2026-02-05', status: 'Delayed', eta: '5h 10m', progress: 30, type: 'Hybrid', region: 'East' },
];

const maintenance = [
    { vehicleId: 'TRN-4521', type: 'Oil Change', mechanic: 'AutoPro Services', issueDescription: 'Routine oil and filter change at 120K km.', cost: 450, startDate: '2026-01-10', endDate: '2026-01-10', status: 'Completed' },
    { vehicleId: 'TRN-5567', type: 'Battery Replacement', mechanic: 'E-Drive Solutions', issueDescription: 'HV battery module replacement, Cell group 4 failure.', cost: 12500, startDate: '2026-01-12', endDate: '2026-01-25', status: 'In Shop' },
    { vehicleId: 'TRN-8901', type: 'Brake Service', mechanic: 'Heavy Duty Works', issueDescription: 'Pad and rotor replacement, rear axle.', cost: 1800, startDate: '2026-01-15', endDate: '2026-01-17', status: 'Completed' },
    { vehicleId: 'TRN-7832', type: 'Tyre Replacement', mechanic: 'TyreFit Express', issueDescription: 'Replace all 4 tyres, alignment check.', cost: 2200, startDate: '2026-01-20', endDate: '2026-01-21', status: 'Completed' },
    { vehicleId: 'TRN-6678', type: 'Engine Repair', mechanic: 'AutoPro Services', issueDescription: 'Transmission seal replacement, vibration diagnostic.', cost: 3500, startDate: '2026-01-22', endDate: '2026-02-05', status: 'Delayed' },
    { vehicleId: 'TRN-3345', type: 'General Service', mechanic: 'Quick Lube Center', issueDescription: 'Full inspection, fluid top-up, filter replacement.', cost: 350, startDate: '2026-02-01', endDate: '2026-02-01', status: 'Scheduled' },
    { vehicleId: 'TRN-1290', type: 'General Service', mechanic: 'E-Drive Solutions', issueDescription: 'Software update, cabin filter, brake fluid check.', cost: 200, startDate: '2026-02-05', endDate: '2026-02-05', status: 'Scheduled' },
    { vehicleId: 'TRN-9900', type: 'Brake Service', mechanic: 'Heavy Duty Works', issueDescription: 'Front disc brake replacement, ABS sensor check.', cost: 2800, startDate: '2026-02-08', endDate: '2026-02-10', status: 'Scheduled' },
];

const fuelLogs = [
    { vehicleId: 'TRN-4521', date: '2026-01-10', liters: 120.5, cost: 421.75 },
    { vehicleId: 'TRN-7832', date: '2026-01-12', liters: 65.0, cost: 227.50 },
    { vehicleId: 'TRN-8901', date: '2026-01-14', liters: 180.3, cost: 631.05 },
    { vehicleId: 'TRN-3345', date: '2026-01-16', liters: 55.0, cost: 192.50 },
    { vehicleId: 'TRN-2234', date: '2026-01-18', liters: 42.0, cost: 147.00 },
    { vehicleId: 'TRN-4521', date: '2026-01-22', liters: 115.8, cost: 405.30 },
    { vehicleId: 'TRN-8901', date: '2026-01-25', liters: 175.0, cost: 612.50 },
    { vehicleId: 'TRN-7832', date: '2026-01-28', liters: 60.0, cost: 210.00 },
    { vehicleId: 'TRN-3345', date: '2026-02-01', liters: 58.5, cost: 204.75 },
    { vehicleId: 'TRN-4410', date: '2026-02-03', liters: 35.0, cost: 122.50 },
];

const expenses = [
    { tripId: 'TR001', vehicleId: 'TRN-4521', toll: 85, other: 45, maint: 0, status: 'Completed' },
    { tripId: 'TR002', vehicleId: 'TRN-7832', toll: 32, other: 20, maint: 0, status: 'Available' },
    { tripId: 'TR003', vehicleId: 'TRN-1290', toll: 120, other: 60, maint: 0, status: 'Available' },
    { tripId: 'TR004', vehicleId: 'TRN-8901', toll: 55, other: 30, maint: 150, status: 'Available' },
    { tripId: 'TR005', vehicleId: 'TRN-3345', toll: 45, other: 0, maint: 0, status: 'Available' },
    { tripId: 'TR007', vehicleId: 'TRN-9900', toll: 65, other: 25, maint: 0, status: 'Available' },
    { tripId: 'TR008', vehicleId: 'TRN-4410', toll: 40, other: 15, maint: 0, status: 'Available' },
];

const roles = [
    {
        roleId: 'ROLE-001', name: 'Administrator', description: 'Full system access',
        assignedUsers: ['admin@transitops.com'],
        permissions: { fleet: ['view', 'create', 'edit', 'delete'], drivers: ['view', 'create', 'edit', 'delete'], trips: ['view', 'create', 'edit', 'delete', 'dispatch'], maintenance: ['view', 'create', 'edit', 'delete', 'approve'], fuel: ['view', 'create', 'edit', 'delete'], analytics: ['view', 'export'], settings: ['view', 'edit', 'manage-roles'] },
    },
    {
        roleId: 'ROLE-002', name: 'Fleet Manager', description: 'Manage fleet and maintenance',
        assignedUsers: ['demo@transitops.com'],
        permissions: { fleet: ['view', 'create', 'edit'], drivers: ['view', 'create', 'edit'], trips: ['view', 'create'], maintenance: ['view', 'create', 'edit', 'approve'], fuel: ['view', 'create'], analytics: ['view', 'export'], settings: ['view'] },
    },
    {
        roleId: 'ROLE-003', name: 'Dispatcher', description: 'Trip dispatching and scheduling',
        assignedUsers: ['dispatcher@transitops.com'],
        permissions: { fleet: ['view'], drivers: ['view'], trips: ['view', 'create', 'edit', 'dispatch'], maintenance: ['view'], fuel: ['view'], analytics: ['view'], settings: [] },
    },
    {
        roleId: 'ROLE-004', name: 'Driver', description: 'View assigned trips and submit reports',
        assignedUsers: ['driver@transitops.com'],
        permissions: { fleet: ['view'], drivers: ['view'], trips: ['view'], maintenance: ['view'], fuel: ['view', 'create'], analytics: [], settings: [] },
    },
    {
        roleId: 'ROLE-005', name: 'Safety Officer', description: 'Safety audits and compliance',
        assignedUsers: ['safety@transitops.com'],
        permissions: { fleet: ['view'], drivers: ['view', 'edit'], trips: ['view'], maintenance: ['view', 'create'], fuel: ['view'], analytics: ['view', 'export'], settings: [] },
    },
    {
        roleId: 'ROLE-006', name: 'Financial Analyst', description: 'Financial oversight and reporting',
        assignedUsers: ['finance@transitops.com'],
        permissions: { fleet: ['view'], drivers: ['view'], trips: ['view'], maintenance: ['view'], fuel: ['view', 'create', 'edit'], analytics: ['view', 'export'], settings: ['view'] },
    },
];

// ─────────────────────── SEED FUNCTION ───────────────────────

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, { dbName: 'TransitOps' });
        console.log('Connected to MongoDB\n');

        // Drop existing data using deleteMany (safer than dropping collections)
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Vehicle.deleteMany({});
        await Driver.deleteMany({});
        await Trip.deleteMany({});
        await Maintenance.deleteMany({});
        await FuelLog.deleteMany({});
        await Expense.deleteMany({});
        await Settings.deleteMany({});
        await Role.deleteMany({});
        console.log('Existing data cleared\n');

        // Seed Users (use create() individually so bcrypt pre-save hook fires)
        console.log('Seeding Users...');
        for (const u of users) {
            await User.create(u);
        }
        console.log(`   -> ${users.length} users created`);

        // Seed Vehicles
        console.log('Seeding Vehicles...');
        await Vehicle.insertMany(vehicles);
        console.log(`   -> ${vehicles.length} vehicles created`);

        // Seed Drivers
        console.log('Seeding Drivers...');
        await Driver.insertMany(drivers);
        console.log(`   -> ${drivers.length} drivers created`);

        // Seed Trips (manual create to skip tripId pre-save since we provide IDs)
        console.log('Seeding Trips...');
        await Trip.insertMany(trips);
        console.log(`   -> ${trips.length} trips created`);

        // Seed Maintenance
        console.log('Seeding Maintenance...');
        await Maintenance.insertMany(maintenance);
        console.log(`   -> ${maintenance.length} maintenance records created`);

        // Seed Fuel Logs
        console.log('Seeding Fuel Logs...');
        await FuelLog.insertMany(fuelLogs);
        console.log(`   -> ${fuelLogs.length} fuel logs created`);

        // Seed Expenses
        console.log('Seeding Expenses...');
        await Expense.insertMany(expenses);
        console.log(`   -> ${expenses.length} expense records created`);

        // Seed Settings
        console.log('Seeding Settings...');
        await Settings.create({});
        console.log('   -> Default settings created');

        // Seed Roles
        console.log('Seeding Roles...');
        await Role.insertMany(roles);
        console.log(`   -> ${roles.length} RBAC roles created`);

        console.log('\n==========================================');
        console.log('  DATABASE SEEDED SUCCESSFULLY!');
        console.log('==========================================');
        console.log('\nDemo Login Credentials:');
        console.log('   Email:    admin@transitops.com');
        console.log('   Password: TransitOps@2026');
        console.log('   (or)');
        console.log('   Email:    demo@transitops.com');
        console.log('   Password: demo@123\n');

        process.exit(0);
    } catch (err) {
        console.error('Seed failed:', err);
        process.exit(1);
    }
}

seed();

