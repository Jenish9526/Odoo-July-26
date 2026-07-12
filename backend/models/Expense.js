import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    tripId:    { type: String, required: true, trim: true, uppercase: true },
    vehicleId: { type: String, required: true, trim: true, uppercase: true },
    toll:      { type: Number, required: true, min: 0, default: 0 },
    other:     { type: Number, required: true, min: 0, default: 0 },
    maint:     { type: Number, required: true, min: 0, default: 0 },
    status:    { type: String, required: true, enum: ['Available', 'Completed'], default: 'Available' },
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
