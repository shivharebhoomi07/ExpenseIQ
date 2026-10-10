import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import ChartCard from '../components/ChartCard';
import * as analyticsApi from '../api/analyticsApi';

// Register ChartJS plugins
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, PointElement, LineElement
);

const Dashboard = () => {
  const [data, setData] = useState({
    category: [],
    monthly: [],
    daily: [],
    topCategories: [],
    budget: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all charts in parallel
      const [catRes, monthRes, dailyRes, topRes, budgetRes] = await Promise.all([
        analyticsApi.getCategoryData(),
        analyticsApi.getMonthlyData(),
        analyticsApi.getDailyData(),
        analyticsApi.getTopCategoriesData(),
        analyticsApi.getBudgetData()
      ]);

      setData({
        category: catRes.data,
        monthly: monthRes.data,
        daily: dailyRes.data,
        topCategories: topRes.data,
        budget: budgetRes.data
      });
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <button onClick={fetchDashboardData} className="btn" style={{ width: 'auto', marginBottom: '20px' }}>
        Refresh Charts
      </button>

      <div className="charts-grid">
        {/* 1. Spending by Category */}
        <ChartCard title="Spending by Category" loading={loading}>
          <Doughnut data={{
            labels: data.category.map(d => d._id),
            datasets: [{
              data: data.category.map(d => d.total),
              backgroundColor: colors,
            }]
          }} />
        </ChartCard>

        {/* 2. Monthly Totals */}
        <ChartCard title="Monthly Totals" loading={loading}>
          <Bar data={{
            labels: data.monthly.map(d => d._id),
            datasets: [{
              label: 'Spent',
              data: data.monthly.map(d => d.total),
              backgroundColor: '#36A2EB'
            }]
          }} />
        </ChartCard>

        {/* 3. Daily Spending Trend (Last 30 Days) */}
        <ChartCard title="Daily Trend (30 Days)" loading={loading}>
          <Line data={{
            labels: data.daily.map(d => d._id),
            datasets: [{
              label: 'Spent',
              data: data.daily.map(d => d.total),
              borderColor: '#FF6384',
              fill: false
            }]
          }} />
        </ChartCard>

        {/* 4. Top 5 Categories */}
        <ChartCard title="Top 5 Categories" loading={loading}>
          <Bar 
            options={{ indexAxis: 'y' }}
            data={{
              labels: data.topCategories.map(d => d._id),
              datasets: [{
                label: 'Spent',
                data: data.topCategories.map(d => d.total),
                backgroundColor: '#FFCE56'
              }]
            }} 
          />
        </ChartCard>

        {/* 5. Budget vs Spent */}
        <ChartCard title="Budget vs Spent (Current Month)" loading={loading}>
          <Bar data={{
            labels: data.budget.map(d => d.category),
            datasets: [
              {
                label: 'Budget',
                data: data.budget.map(d => d.budget),
                backgroundColor: '#C9CBCF'
              },
              {
                label: 'Spent',
                data: data.budget.map(d => d.spent),
                backgroundColor: '#4BC0C0'
              }
            ]
          }} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
