import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import Driver from '../models/Driver.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import User from '../models/User.js';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const vehicles = [
  { registrationNumber: 'TX-2938-A', vehicleName: 'Ford Transit Cargo',  model: '2023 Transit 250',  type: 'Van',     capacity: '1,500 kg cargo', odometer: 42300,  acquisitionCost: 46000, status: 'Available' },
  { registrationNumber: 'CA-9481-X', vehicleName: 'Tesla Model Y',        model: '2024 Long Range',   type: 'Electric',capacity: '5 Passengers',   odometer: 12400,  acquisitionCost: 52000, status: 'On Trip'   },
  { registrationNumber: 'NY-8842-M', vehicleName: 'Chevrolet Silverado',  model: '2022 Custom',       type: 'Truck',   capacity: '2,200 kg cargo', odometer: 68100,  acquisitionCost: 39500, status: 'In Shop'   },
  { registrationNumber: 'FL-7321-K', vehicleName: 'Toyota Corolla',       model: '2023 LE Hybrid',    type: 'Hybrid',  capacity: '5 Passengers',   odometer: 28900,  acquisitionCost: 24500, status: 'Available' },
  { registrationNumber: 'IL-5930-P', vehicleName: 'Freightliner M2',      model: '2021 Box Truck',    type: 'Truck',   capacity: '7,500 kg cargo', odometer: 148000, acquisitionCost: 89000, status: 'Retired'   },
  { registrationNumber: 'NV-2019-S', vehicleName: 'Rivian R1T',           model: '2023 Adventure',    type: 'Electric',capacity: '5 Passengers',   odometer: 18500,  acquisitionCost: 73000, status: 'On Trip'   },
  { registrationNumber: 'TX-1049-D', vehicleName: 'Honda Odyssey',        model: '2022 EX-L',         type: 'Minivan', capacity: '8 Passengers',   odometer: 35100,  acquisitionCost: 37200, status: 'Available' },
];

const drivers = [
  { driverName: 'Marcus Vance',    licenseNumber: 'DL-284902A', licenseCategory: 'Class A CDL',       expiryDate: '2028-10-15', phone: '+1-555-0198', safetyScore: 98, status: 'Available' },
  { driverName: 'Elena Rostova',   licenseNumber: 'DL-901842X', licenseCategory: 'Standard Passenger', expiryDate: '2029-04-20', phone: '+1-555-0122', safetyScore: 95, status: 'On Trip'   },
  { driverName: 'John Callahan',   licenseNumber: 'DL-192842M', licenseCategory: 'Class B CDL',       expiryDate: '2027-08-11', phone: '+1-555-0155', safetyScore: 82, status: 'Off Duty'  },
  { driverName: 'Sophia Martinez', licenseNumber: 'DL-102938K', licenseCategory: 'Class C',           expiryDate: '2028-12-05', phone: '+1-555-0188', safetyScore: 91, status: 'Available' },
  { driverName: 'Alex Chen',       licenseNumber: 'DL-829104P', licenseCategory: 'Class B CDL',       expiryDate: '2025-06-18', phone: '+1-555-0144', safetyScore: 54, status: 'Suspended' },
  { driverName: 'Frank Thompson',  licenseNumber: 'DL-449102T', licenseCategory: 'Class A CDL',       expiryDate: '2028-09-30', phone: '+1-555-0133', safetyScore: 88, status: 'On Trip'   },
  { driverName: 'David Miller',    licenseNumber: 'DL-773012S', licenseCategory: 'Class C',           expiryDate: '2027-02-14', phone: '+1-555-0100', safetyScore: 92, status: 'Available' },
];

const trips = [
  { tripId: 'TR001', source: 'Gandhinagar', destination: 'Ahmedabad', vehicleId: 'VAN-05',   driverName: 'Alex Chen',    status: 'Dispatched', eta: '45 min', progress: 65, notes: 'Priority delivery',         type: 'Van',   region: 'North' },
  { tripId: 'TR002', source: 'Vatva',       destination: 'Sanand',    vehicleId: 'TRUCK-02', driverName: 'Awaiting Driver', status: 'Draft',   eta: 'TBD',    progress: 0,  notes: 'Morning batch transfer',    type: 'Truck', region: 'East'  },
  { tripId: 'TR003', source: 'Mansa',       destination: 'Kalol',     vehicleId: 'TANKER-01',driverName: 'John Callahan', status: 'Cancelled',eta: '--',     progress: 0,  notes: 'Vehicle sent to Maintenance',type: 'Van',   region: 'West'  },
];

const fuelLogs = [
  { vehicleId: 'VAN-05',   date: '05 Jul 2026', liters: 42,  cost: 3150 },
  { vehicleId: 'TRUCK-11', date: '06 Jul 2026', liters: 110, cost: 8400 },
  { vehicleId: 'MINI-08',  date: '06 Jul 2026', liters: 28,  cost: 2050 },
];

const expenses = [
  { tripId: 'TR001', vehicleId: 'VAN-05',  toll: 120, other: 0,    maint: 0,     status: 'Available' },
  { tripId: 'TR002', vehicleId: 'TRK-12',  toll: 340, other: 150,  maint: 18000, status: 'Completed' },
  { tripId: 'TR003', vehicleId: 'MINI-08', toll: 0,   other: 1860, maint: 0,     status: 'Available' },
];

const maintenanceLogs = [
  { vehicleId: 'Van-05',   type: 'Oil Change',       mechanic: 'Bill Evans',    cost: 120,  startDate: '2026-07-10', endDate: '2026-07-11', status: 'Completed' },
  { vehicleId: 'Truck-02', type: 'Engine Repair',    mechanic: 'Dave Miller',   cost: 1850, startDate: '2026-07-12', endDate: '2026-07-15', status: 'In Shop'   },
  { vehicleId: 'Tanker-01',type: 'Brake Service',    mechanic: 'Chris Evans',   cost: 450,  startDate: '2026-07-13', endDate: '2026-07-14', status: 'Scheduled' },
  { vehicleId: 'Van-09',   type: 'Tyre Replacement', mechanic: 'Marcus Vance',  cost: 320,  startDate: '2026-07-09', endDate: '2026-07-10', status: 'Completed' },
  { vehicleId: 'Semi-11',  type: 'General Service',  mechanic: 'Robert Downey', cost: 890,  startDate: '2026-07-08', endDate: '2026-07-11', status: 'Delayed'   },
];

const users = [
  { name: 'Admin User',      email: 'admin@transitops.com',    password: 'adminpassword',    role: 'Administrator' },
  { name: 'Dispatcher User', email: 'dispatch@transitops.com', password: 'dispatchpassword', role: 'Dispatcher'    },
  { name: 'Driver User',     email: 'driver@transitops.com',   password: 'driverpassword',   role: 'Driver'        },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([
    Vehicle.deleteMany({}),
    Trip.deleteMany({}),
    Driver.deleteMany({}),
    FuelLog.deleteMany({}),
    Expense.deleteMany({}),
    MaintenanceLog.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  await Vehicle.insertMany(vehicles);
  console.log(`Seeded ${vehicles.length} vehicles`);

  await Trip.insertMany(trips);
  console.log(`Seeded ${trips.length} trips`);

  await Driver.insertMany(drivers);
  console.log(`Seeded ${drivers.length} drivers`);

  await FuelLog.insertMany(fuelLogs);
  console.log(`Seeded ${fuelLogs.length} fuel logs`);

  await Expense.insertMany(expenses);
  console.log(`Seeded ${expenses.length} expenses`);

  await MaintenanceLog.insertMany(maintenanceLogs);
  console.log(`Seeded ${maintenanceLogs.length} maintenance logs`);

  // Hash passwords before inserting users
  const hashedUsers = await Promise.all(
    users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
  );
  await User.insertMany(hashedUsers);
  console.log(`Seeded ${users.length} users`);

  await mongoose.disconnect();
  console.log('Done. Database seeded successfully.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
