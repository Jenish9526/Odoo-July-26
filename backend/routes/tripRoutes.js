import { Router } from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripStats,
  getWeeklyTripVolume,
} from '../controllers/tripController.js';

const router = Router();

router.get('/stats', getTripStats);
router.get('/weekly', getWeeklyTripVolume);
router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTripById).put(updateTrip).delete(deleteTrip);

export default router;
