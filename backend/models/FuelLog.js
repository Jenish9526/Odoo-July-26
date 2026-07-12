import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true, trim: true, uppercase: true },
    date:      { type: String, required: true },
    liters:    { type: Number, required: true, min: 0 },
    cost:      { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('FuelLog', fuelLogSchema);
