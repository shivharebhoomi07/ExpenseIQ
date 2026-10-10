import { useState, useEffect, useCallback } from 'react';
import * as expenseApi from '../api/expenseApi';

// Custom hook keeps components clean and centralizes expense state
export const useExpenses = (initialParams = {}) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [params, setParams] = useState(initialParams);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseApi.fetchExpenses(params);
      setExpenses(res.data.expenses);
      setPagination({ page: res.data.page, pages: res.data.pages, total: res.data.total });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching expenses');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  return { 
    expenses, 
    loading, 
    error, 
    pagination, 
    params, 
    setParams, 
    reload: loadExpenses 
  };
};
