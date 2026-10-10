import Expense from '../models/Expense.js';

// Aggregate total spending by category for pie/doughnut charts
export const getSpendingByCategory = async (userId) => {
  return Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);
};

// Aggregate spending by month (e.g., '2023-10') for bar charts
export const getMonthlyTotals = async (userId) => {
  return Expense.aggregate([
    { $match: { user: userId } },
    { 
      $group: { 
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, 
        total: { $sum: '$amount' } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);
};

// Aggregate spending by day for the last 30 days for line charts
export const getDailyTrend = async (userId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return Expense.aggregate([
    { $match: { user: userId, date: { $gte: thirtyDaysAgo } } },
    { 
      $group: { 
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
        total: { $sum: '$amount' } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);
};

// Top 5 highest spending categories overall
export const getTopCategories = async (userId) => {
  return Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);
};

// Fixed budgets for simplicity. In a real app, this would come from a Budget model.
const FIXED_BUDGETS = {
  'Food': 500,
  'Travel': 300,
  'Rent': 1500,
  'Shopping': 400,
  'Bills': 250,
  'Health': 200,
  'Other': 150
};

// Compares current month's spending vs fixed budgets per category
export const getBudgetVsSpent = async (userId) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0,0,0,0);

  const spent = await Expense.aggregate([
    { $match: { user: userId, date: { $gte: startOfMonth } } },
    { $group: { _id: '$category', spent: { $sum: '$amount' } } }
  ]);

  return Object.keys(FIXED_BUDGETS).map(cat => {
    const spentObj = spent.find(s => s._id === cat);
    return {
      category: cat,
      budget: FIXED_BUDGETS[cat],
      spent: spentObj ? spentObj.spent : 0
    };
  });
};
