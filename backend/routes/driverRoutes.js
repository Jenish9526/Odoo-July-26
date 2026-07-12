import { Router } from 'express';
import {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getDriverStats,
} from '../controllers/driverController.js';

const router = Router();

router.get('/stats', getDriverStats);
router.route('/').get(getDrivers).post(createDriver);
router.route('/:id').get(getDriverById).put(updateDriver).delete(deleteDriver);

export default router;
