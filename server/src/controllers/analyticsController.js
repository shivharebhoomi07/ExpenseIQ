import * as analyticsService from '../services/analyticsService.js';

// Keep controllers thin: extract user ID and call the service.
export const getSpendingByCategory = async (req, res, next) => {
  try {
    const data = await analyticsService.getSpendingByCategory(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTotals = async (req, res, next) => {
  try {
    const data = await analyticsService.getMonthlyTotals(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getDailyTrend = async (req, res, next) => {
  try {
    const data = await analyticsService.getDailyTrend(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getTopCategories = async (req, res, next) => {
  try {
    const data = await analyticsService.getTopCategories(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getBudgetVsSpent = async (req, res, next) => {
  try {
    const data = await analyticsService.getBudgetVsSpent(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
