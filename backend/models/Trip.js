import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    tripId:          { type: String, unique: true },
    source:          { type: String, required: true, trim: true },
    destination:     { type: String, required: true, trim: true },
    vehicleId:       { type: String, required: true, trim: true },
    driverName:      { type: String, required: true, trim: true },
    cargoWeight:     { type: Number, default: 0 },
    plannedDistance: { type: Number, default: 0 },
    estDuration:     { type: Number, default: 0 },
    departureDate:   { type: String, default: '' },
    notes:           { type: String, default: '' },
    status:          { type: String, required: true, enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'], default: 'Draft' },
    eta:             { type: String, default: 'TBD' },
    progress:        { type: Number, default: 0, min: 0, max: 100 },
    // Legacy dashboard filter fields
    type:            { type: String, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Electric', 'Hybrid', 'Minivan', 'Tanker', 'Semi-Trailer'], default: 'Van' },
    region:          { type: String, enum: ['North', 'East', 'South', 'West'], default: 'North' },
    departure:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

tripSchema.pre('save', async function (next) {
  if (!this.tripId) {
    const count = await mongoose.model('Trip').countDocuments();
    this.tripId = `TR${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('Trip', tripSchema);
