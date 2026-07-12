import { Router } from 'express';
import {
  getFuelLogs,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getFuelExpenseSummary,
} from '../controllers/fuelExpenseController.js';

const router = Router();

// Summary
router.get('/summary', getFuelExpenseSummary);

// Fuel logs
router.route('/fuel').get(getFuelLogs).post(createFuelLog);
router.route('/fuel/:id').put(updateFuelLog).delete(deleteFuelLog);

// Expenses
router.route('/expenses').get(getExpenses).post(createExpense);
router.route('/expenses/:id').put(updateExpense).delete(deleteExpense);

export default router;
