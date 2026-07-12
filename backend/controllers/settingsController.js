import Settings from '../models/Settings.js';
import Role from '../models/Role.js';

// ═══════════════════ SETTINGS ═══════════════════

// GET /api/settings
export const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json({ success: true, data: settings });
    } catch (err) { next(err); }
};

// PUT /api/settings
export const updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            Object.assign(settings, req.body);
            await settings.save();
        }
        res.json({ success: true, data: settings, message: 'Settings saved successfully' });
    } catch (err) { next(err); }
};

// ═══════════════════ ROLES (RBAC) ═══════════════════

// GET /api/settings/roles
export const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find().sort({ createdAt: 1 });
        res.json({ success: true, data: roles });
    } catch (err) { next(err); }
};

// GET /api/settings/roles/:id
export const getRoleById = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        res.json({ success: true, data: role });
    } catch (err) { next(err); }
};

// PUT /api/settings/roles/:id
export const updateRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });
        res.json({ success: true, data: role, message: `Permissions updated for ${role.name}` });
    } catch (err) { next(err); }
};
