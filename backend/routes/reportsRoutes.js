import { Router } from 'express';
import { getReportsData } from '../controllers/reportsController.js';

const router = Router();

router.get('/', getReportsData);

export default router;
