import { Router } from 'express';
import {
    getAllLogs,
    getMaintenanceStats,
    getLogById,
    createLog,
    updateLog,
    completeLog,
    deleteLog,
} from '../controllers/maintenanceController.js';

const router = Router();

router.get('/stats', getMaintenanceStats);
router.get('/', getAllLogs);
router.get('/:id', getLogById);
router.post('/', createLog);
router.put('/:id', updateLog);
router.put('/:id/complete', completeLog);
router.delete('/:id', deleteLog);

export default router;
