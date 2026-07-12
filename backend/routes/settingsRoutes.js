import { Router } from 'express';
import {
    getSettings,
    updateSettings,
    getAllRoles,
    getRoleById,
    updateRole,
} from '../controllers/settingsController.js';

const router = Router();

// Settings
router.get('/', getSettings);
router.put('/', updateSettings);

// RBAC Roles
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.put('/roles/:id', updateRole);

export default router;
