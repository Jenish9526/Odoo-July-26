import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    vehicleName:        { type: String, required: true, trim: true },
    model:              { type: String, required: true, trim: true },
    type:               { type: String, required: true, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Electric', 'Hybrid', 'Minivan'] },
    capacity:           { type: String, required: true },
    odometer:           { type: Number, required: true, min: 0 },
    acquisitionCost:    { type: Number, required: true, min: 0 },
    status:             { type: String, required: true, enum: ['Available', 'On Trip', 'In Shop', 'Retired'], default: 'Available' },
  },
  { timestamps: true }
);

export default mongoose.model('Vehicle', vehicleSchema);
