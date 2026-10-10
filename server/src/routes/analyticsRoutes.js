import express from 'express';
import { 
  getSpendingByCategory, 
  getMonthlyTotals, 
  getDailyTrend, 
  getTopCategories,
  getBudgetVsSpent
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/category', getSpendingByCategory);
router.get('/monthly', getMonthlyTotals);
router.get('/daily', getDailyTrend);
router.get('/top-categories', getTopCategories);
router.get('/budget', getBudgetVsSpent);

export default router;
