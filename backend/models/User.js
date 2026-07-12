import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
        role: { type: String, required: true, enum: ['Administrator', 'Dispatcher', 'Driver', 'Fleet Manager', 'Safety Officer', 'Financial Analyst'], default: 'Dispatcher' },
        name: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Hash password before saving (Mongoose v9: no next callback, use async)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
