import axiosInstance from './axiosConfig';

export const getCategoryData = () => axiosInstance.get('/analytics/category');
export const getMonthlyData = () => axiosInstance.get('/analytics/monthly');
export const getDailyData = () => axiosInstance.get('/analytics/daily');
export const getTopCategoriesData = () => axiosInstance.get('/analytics/top-categories');
export const getBudgetData = () => axiosInstance.get('/analytics/budget');
