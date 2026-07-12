import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
  {
    driverName:       { type: String, required: true, trim: true },
    licenseNumber:    { type: String, required: true, unique: true, trim: true, uppercase: true },
    licenseCategory:  { type: String, required: true, enum: ['Class A CDL', 'Class B CDL', 'Class C', 'Standard Passenger'] },
    expiryDate:       { type: String, required: true },
    phone:            { type: String, required: true, trim: true },
    safetyScore:      { type: Number, required: true, min: 0, max: 100, default: 80 },
    status:           { type: String, required: true, enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'], default: 'Available' },
  },
  { timestamps: true }
);

export default mongoose.model('Driver', driverSchema);
