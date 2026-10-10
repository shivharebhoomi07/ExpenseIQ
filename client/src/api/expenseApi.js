import axiosInstance from './axiosConfig';

export const fetchExpenses = (params) => axiosInstance.get('/expenses', { params });
export const createExpense = (data) => axiosInstance.post('/expenses', data);
export const updateExpense = (id, data) => axiosInstance.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => axiosInstance.delete(`/expenses/${id}`);
