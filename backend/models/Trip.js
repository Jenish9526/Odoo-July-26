import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    tripId:    { type: String, required: true, unique: true },
    vehicle:   { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver:    { type: String, required: true, trim: true },
    type:      { type: String, required: true, enum: ['Sedan', 'SUV', 'Truck', 'Van', 'Electric', 'Hybrid', 'Minivan'] },
    region:    { type: String, required: true, enum: ['North', 'East', 'South', 'West'] },
    status:    { type: String, required: true, enum: ['In Progress', 'Completed', 'Delayed', 'Scheduled'], default: 'Scheduled' },
    departure: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate tripId before saving
tripSchema.pre('save', async function (next) {
  if (!this.tripId) {
    const count = await mongoose.model('Trip').countDocuments();
    this.tripId = `TRIP-${900 + count + 1}`;
  }
  next();
});

export default mongoose.model('Trip', tripSchema);
