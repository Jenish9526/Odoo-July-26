import { Router } from 'express';
import {
    getAllFuelLogs,
    createFuelLog,
    updateFuelLog,
    deleteFuelLog,
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getFuelExpenseStats,
} from '../controllers/fuelExpenseController.js';

const router = Router();

// Fuel logs
router.get('/stats', getFuelExpenseStats);
router.get('/', getAllFuelLogs);
router.post('/', createFuelLog);
router.put('/:id', updateFuelLog);
router.delete('/:id', deleteFuelLog);

export default router;
