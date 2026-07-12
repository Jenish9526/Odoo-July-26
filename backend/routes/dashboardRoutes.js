import { Router } from 'express';
import { getDashboardStats, getRecentTrips } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recent-trips', getRecentTrips);

export default router;
