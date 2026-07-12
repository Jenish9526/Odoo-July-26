import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
    {
        companyName: { type: String, default: 'TransitOps Global' },
        companyAddress: { type: String, default: '102 Logistics Blvd, Building 4, Texas, USA' },
        orgEmail: { type: String, default: 'ops@transitops.com' },
        contactNo: { type: String, default: '+1 (555) 321-7890' },
        currency: { type: String, default: 'USD ($)' },
        distanceUnit: { type: String, default: 'Kilometers' },
        timezone: { type: String, default: 'UTC-5 (EST)' },
        language: { type: String, default: 'English' },
        dateFormat: { type: String, default: 'YYYY-MM-DD' },
        defaultDashboard: { type: String, default: 'Operational KPIs' },
        theme: { type: String, default: 'Dark' },
        // System config
        emailNotify: { type: Boolean, default: true },
        smsAlerts: { type: Boolean, default: true },
        licenseAlerts: { type: Boolean, default: true },
        maintReminder: { type: Boolean, default: true },
        fuelAlerts: { type: Boolean, default: false },
        backupSchedule: { type: String, default: 'Daily (02:00 UTC)' },
        logoutTimer: { type: String, default: '30 min' },
        twoFactorEnabled: { type: Boolean, default: true },
        // Security
        minPassLength: { type: Number, default: 8 },
        passExpiry: { type: String, default: '90 Days' },
        failedLoginLimit: { type: Number, default: 5 },
    },
    { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
