import { Router } from 'express';
import {
  getMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog,
  completeMaintenanceLog,
  getMaintenanceStats,
} from '../controllers/maintenanceController.js';

const router = Router();

router.get('/stats', getMaintenanceStats);
router.route('/').get(getMaintenanceLogs).post(createMaintenanceLog);
router.route('/:id').get(getMaintenanceLogById).put(updateMaintenanceLog).delete(deleteMaintenanceLog);
router.patch('/:id/complete', completeMaintenanceLog);

export default router;
