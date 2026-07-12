import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
    {
        vehicleId: { type: String, required: true, trim: true },
        type: { type: String, required: true, enum: ['Oil Change', 'Brake Service', 'Tyre Replacement', 'Engine Repair', 'Battery Replacement', 'General Service'] },
        mechanic: { type: String, required: true, trim: true },
        issueDescription: { type: String, default: '' },
        cost: { type: Number, required: true, min: 0 },
        startDate: { type: String, required: true },
        endDate: { type: String, required: true },
        status: { type: String, required: true, enum: ['Scheduled', 'In Shop', 'Completed', 'Delayed'], default: 'Scheduled' },
    },
    { timestamps: true }
);

export default mongoose.model('Maintenance', maintenanceSchema);
