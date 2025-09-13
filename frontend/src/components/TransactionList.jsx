// Transaction List Component for displaying and managing transactions
import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from '../utils/constants';
import transactionService from '../services/transactionService';

const TransactionList = ({ onEdit, onDelete }) => {
  const { 
    transactions, 
    loading, 
    error, 
    loadTransactions, 
    deleteTransaction,
    clearError 
  } = useTransactions();

  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState('transactionDate');
  const [sortDir, setSortDir] = useState('desc');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Load transactions when component mounts or filters change
  useEffect(() => {
    loadTransactions(currentPage, 10, sortBy, sortDir);
  }, [currentPage, sortBy, sortDir]); // Removed loadTransactions from dependencies

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        // Reload transactions to refresh the list
        loadTransactions(currentPage, 10, sortBy, sortDir);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleFilterByType = (type) => {
    setFilterType(type);
    // You could implement filtering logic here
  };

  const clearFilters = () => {
    setFilterType('');
    setFilterCategory('');
    loadTransactions(0, 10, sortBy, sortDir);
  };

  const getTransactionTypeClass = (type) => {
    return type === TRANSACTION_TYPES.INCOME ? 'income' : 'expense';
  };

  const getTransactionTypeIcon = (type) => {
    return type === TRANSACTION_TYPES.INCOME ? '↗️' : '↘️';
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="transaction-list">
        <div className="loading-container">
          <div className="loading-spinner">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <div className="list-header">
        <h3>Transactions</h3>
        <div className="list-actions">
          <button 
            className="btn-secondary"
            onClick={() => loadTransactions(0, 10, sortBy, sortDir)}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError} className="clear-error-btn">×</button>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Filter by Type:</label>
          <select 
            value={filterType} 
            onChange={(e) => handleFilterByType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value={TRANSACTION_TYPES.INCOME}>Income</option>
            <option value={TRANSACTION_TYPES.EXPENSE}>Expense</option>
          </select>
        </div>
        
        <button onClick={clearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found. Add your first transaction to get started!</p>
        </div>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th 
                  className="sortable"
                  onClick={() => handleSort('transactionDate')}
                >
                  Date {sortBy === 'transactionDate' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('description')}
                >
                  Description {sortBy === 'description' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('type')}
                >
                  Type {sortBy === 'type' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('amount')}
                >
                  Amount {sortBy === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('category')}
                >
                  Category {sortBy === 'category' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="transaction-row">
                  <td className="date-cell">
                    {transactionService.formatDate(transaction.transactionDate)}
                  </td>
                  <td className="description-cell">
                    <div className="description-content">
                      <span className="description-text">{transaction.description}</span>
                      {transaction.notes && (
                        <span className="notes-text">{transaction.notes}</span>
                      )}
                    </div>
                  </td>
                  <td className="type-cell">
                    <span className={`type-badge ${getTransactionTypeClass(transaction.type)}`}>
                      {getTransactionTypeIcon(transaction.type)} {TRANSACTION_TYPE_LABELS[transaction.type]}
                    </span>
                  </td>
                  <td className="amount-cell">
                    <span className={`amount ${getTransactionTypeClass(transaction.type)}`}>
                      {transactionService.formatAmount(transaction.amount)}
                    </span>
                  </td>
                  <td className="category-cell">
                    {transaction.category || '-'}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => onEdit && onEdit(transaction)}
                        title="Edit transaction"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(transaction.id)}
                        title="Delete transaction"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {transactions.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="btn-secondary"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage + 1}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={transactions.length < 10}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
