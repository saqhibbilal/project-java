// Analytics Charts Component using Chart.js
import React, { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AnalyticsCharts = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('category');

  // Load analytics data on component mount
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Load analytics data
  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load category summary data
      const categoryResponse = await transactionService.getCategorySummary();
      setCategoryData(categoryResponse);

      // Load monthly trends data
      const monthlyResponse = await transactionService.getMonthlyTrends();
      setMonthlyData(monthlyResponse);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare category chart data
  const prepareCategoryChartData = () => {
    if (!categoryData || categoryData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = categoryData.map(item => item.category);
    const expenseData = categoryData.map(item => item.expenseAmount);
    const incomeData = categoryData.map(item => item.incomeAmount);

    // Generate colors for categories
    const colors = generateColors(categoryData.length);

    return {
      labels,
      datasets: [
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: colors.map(color => `${color}80`), // 50% opacity
          borderColor: colors,
          borderWidth: 1,
        },
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: colors.map(color => `${color}40`), // 25% opacity
          borderColor: colors,
          borderWidth: 1,
        }
      ]
    };
  };

  // Prepare monthly trends chart data
  const prepareMonthlyTrendsData = () => {
    if (!monthlyData || monthlyData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Sort by month
    const sortedData = [...monthlyData].sort((a, b) => a.month.localeCompare(b.month));
    
    const labels = sortedData.map(item => {
      const date = new Date(item.month);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const incomeData = sortedData.map(item => item.income);
    const expenseData = sortedData.map(item => item.expenses);

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        }
      ]
    };
  };

  // Prepare doughnut chart data for expense breakdown
  const prepareDoughnutChartData = () => {
    if (!categoryData || categoryData.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = categoryData.map(item => item.category);
    const data = categoryData.map(item => item.expenseAmount);
    const colors = generateColors(categoryData.length);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color + 'CC'), // 80% opacity
          borderWidth: 2,
        }
      ]
    };
  };

  // Generate colors for charts
  const generateColors = (count) => {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
      '#14B8A6', '#F43F5E', '#8B5A2B', '#059669', '#DC2626'
    ];
    
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'category' ? 'Category Breakdown' : 'Monthly Trends'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Expense Breakdown by Category'
      },
    },
  };

  if (loading) {
    return (
      <div className="analytics-charts loading">
        <div className="loading-spinner">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-charts error">
        <div className="error-message">
          <h3>Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={loadAnalyticsData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-charts">
      <div className="charts-header">
        <h3>Analytics Dashboard</h3>
        <div className="chart-controls">
          <button
            className={`btn ${chartType === 'category' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartType('category')}
          >
            Category View
          </button>
          <button
            className={`btn ${chartType === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartType('monthly')}
          >
            Monthly View
          </button>
        </div>
      </div>

      <div className="charts-grid">
        {/* Main Chart */}
        <div className="chart-container">
          {chartType === 'category' ? (
            <Bar data={prepareCategoryChartData()} options={chartOptions} />
          ) : (
            <Line data={prepareMonthlyTrendsData()} options={chartOptions} />
          )}
        </div>

        {/* Doughnut Chart */}
        <div className="chart-container doughnut-chart">
          <Doughnut data={prepareDoughnutChartData()} options={doughnutOptions} />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="analytics-summary">
        <div className="summary-card">
          <h4>Total Categories</h4>
          <span className="summary-value">{categoryData.length}</span>
        </div>
        <div className="summary-card">
          <h4>Total Months</h4>
          <span className="summary-value">{monthlyData.length}</span>
        </div>
        <div className="summary-card">
          <h4>Top Category</h4>
          <span className="summary-value">
            {categoryData.length > 0 
              ? categoryData.reduce((max, item) => 
                  item.expenseAmount > max.expenseAmount ? item : max
                ).category
              : 'N/A'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
