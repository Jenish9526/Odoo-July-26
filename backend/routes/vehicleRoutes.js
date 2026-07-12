import { Router } from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
} from '../controllers/vehicleController.js';

const router = Router();

router.get('/stats', getVehicleStats);
router.route('/').get(getVehicles).post(createVehicle);
router.route('/:id').get(getVehicleById).put(updateVehicle).delete(deleteVehicle);

export default router;
