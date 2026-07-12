import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
    {
        roleId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        assignedUsers: [{ type: String }],
        permissions: {
            fleet: [{ type: String }],
            drivers: [{ type: String }],
            trips: [{ type: String }],
            maintenance: [{ type: String }],
            fuel: [{ type: String }],
            analytics: [{ type: String }],
            settings: [{ type: String }],
        },
    },
    { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
