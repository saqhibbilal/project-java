// Analytics Dashboard Page
import React, { useState, useEffect } from 'react';
import AnalyticsCharts from '../components/AnalyticsCharts';
import { useTransactions } from '../context/TransactionContext';
import transactionService from '../services/transactionService';

const AnalyticsPage = () => {
  const { summary, loadSummary } = useTransactions();
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Load all analytics data
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadSummary(),
        loadCategoryData(),
        loadMonthlyData(),
        loadFilteredTransactions()
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load category analytics data
  const loadCategoryData = async () => {
    try {
      const data = await transactionService.getCategorySummary();
      setCategoryData(data);
    } catch (error) {
      console.error('Error loading category data:', error);
    }
  };

  // Load monthly trends data
  const loadMonthlyData = async () => {
    try {
      const data = await transactionService.getMonthlyTrends();
      setMonthlyData(data);
    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  };

  // Load filtered transactions
  const loadFilteredTransactions = async () => {
    try {
      let data = [];
      
      if (filters.startDate && filters.endDate) {
        if (filters.type) {
          data = await transactionService.getTransactionsByTypeAndDateRange(
            filters.type, 
            filters.startDate, 
            filters.endDate
          );
        } else {
          data = await transactionService.getTransactionsByDateRange(
            filters.startDate, 
            filters.endDate
          );
        }
      } else {
        data = await transactionService.getAllTransactions();
      }
      
      // No category filtering in analytics page
      
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error loading filtered transactions:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const applyFilters = async () => {
    setLoading(true);
    try {
      await loadFilteredTransactions();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: ''
    });
    loadFilteredTransactions();
  };

  // Calculate filtered summary
  const calculateFilteredSummary = () => {
    if (!Array.isArray(filteredTransactions)) {
      return {
        income: 0,
        expenses: 0,
        netWorth: 0,
        transactionCount: 0
      };
    }
    
    const income = filteredTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      income,
      expenses,
      netWorth: income - expenses,
      transactionCount: filteredTransactions.length
    };
  };

  const filteredSummary = calculateFilteredSummary();

  // No category filtering needed

  return (
    <div className="analytics-page">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your spending patterns and financial insights</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={loadAllData} className="btn btn-sm">
            Retry
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Income</h3>
          <div className="summary-value income">
            ${summary?.totalIncome?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <div className="summary-value expense">
            ${summary?.totalExpenses?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="summary-card">
          <h3>Net Worth</h3>
          <div className={`summary-value ${summary?.netWorth >= 0 ? 'positive' : 'negative'}`}>
            ${summary?.netWorth?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="summary-card">
          <h3>Total Transactions</h3>
          <div className="summary-value">
            {(summary?.incomeCount || 0) + (summary?.expenseCount || 0)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>
          
          
          <div className="filter-actions">
            <button onClick={applyFilters} className="btn btn-primary" disabled={loading}>
              Apply Filters
            </button>
            <button onClick={clearFilters} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filtered Summary */}
      {(filters.startDate || filters.endDate || filters.type) && (
        <div className="filtered-summary">
          <h3>Filtered Results</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <h4>Filtered Income</h4>
              <div className="summary-value income">
                ${filteredSummary.income.toFixed(2)}
              </div>
            </div>
            <div className="summary-card">
              <h4>Filtered Expenses</h4>
              <div className="summary-value expense">
                ${filteredSummary.expenses.toFixed(2)}
              </div>
            </div>
            <div className="summary-card">
              <h4>Filtered Net Worth</h4>
              <div className={`summary-value ${filteredSummary.netWorth >= 0 ? 'positive' : 'negative'}`}>
                ${filteredSummary.netWorth.toFixed(2)}
              </div>
            </div>
            <div className="summary-card">
              <h4>Transactions</h4>
              <div className="summary-value">
                {filteredSummary.transactionCount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="charts-section">
        <AnalyticsCharts />
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="category-breakdown">
          <h3>Category Breakdown</h3>
          <div className="category-list">
            {categoryData.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-header">
                  <h4>{category.category}</h4>
                  <span className="transaction-count">
                    {category.transactionCount} transactions
                  </span>
                </div>
                <div className="category-amounts">
                  <div className="amount income">
                    Income: ${category.incomeAmount.toFixed(2)}
                  </div>
                  <div className="amount expense">
                    Expenses: ${category.expenseAmount.toFixed(2)}
                  </div>
                  <div className="amount total">
                    Total: ${category.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {monthlyData.length > 0 && (
        <div className="monthly-trends">
          <h3>Monthly Trends</h3>
          <div className="trends-list">
            {monthlyData
              .sort((a, b) => a.month.localeCompare(b.month))
              .map((month, index) => (
                <div key={index} className="trend-item">
                  <div className="month-header">
                    <h4>{new Date(month.month).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}</h4>
                    <span className="transaction-count">
                      {month.transactionCount} transactions
                    </span>
                  </div>
                  <div className="month-amounts">
                    <div className="amount income">
                      Income: ${month.income.toFixed(2)}
                    </div>
                    <div className="amount expense">
                      Expenses: ${month.expenses.toFixed(2)}
                    </div>
                    <div className={`amount ${month.income - month.expenses >= 0 ? 'positive' : 'negative'}`}>
                      Net: ${(month.income - month.expenses).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
