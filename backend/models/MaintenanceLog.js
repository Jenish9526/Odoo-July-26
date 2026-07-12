import mongoose from 'mongoose';

const maintenanceLogSchema = new mongoose.Schema(
  {
    vehicleId:        { type: String, required: true, trim: true },
    type:             { type: String, required: true, enum: ['Oil Change', 'Brake Service', 'Tyre Replacement', 'Engine Repair', 'Battery Replacement', 'General Service'] },
    mechanic:         { type: String, required: true, trim: true },
    issueDescription: { type: String, trim: true, default: '' },
    cost:             { type: Number, required: true, min: 0 },
    startDate:        { type: String, required: true },
    endDate:          { type: String, required: true },
    status:           { type: String, required: true, enum: ['Scheduled', 'In Shop', 'Completed', 'Delayed'], default: 'In Shop' },
  },
  { timestamps: true }
);

export default mongoose.model('MaintenanceLog', maintenanceLogSchema);
