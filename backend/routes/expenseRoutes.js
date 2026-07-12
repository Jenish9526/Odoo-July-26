import { Router } from 'express';
import {
    getAllExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from '../controllers/fuelExpenseController.js';

const router = Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
