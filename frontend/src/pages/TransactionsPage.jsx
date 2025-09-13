// Transactions Page - Main page for transaction management
import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { TRANSACTION_TYPES } from '../utils/constants';

const TransactionsPage = () => {
  const { 
    transactions, 
    summary, 
    loadTransactions, 
    loadSummary, 
    loadCategories,
    categories 
  } = useTransactions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Load initial data
  useEffect(() => {
    loadTransactions();
    loadSummary();
    loadCategories();
  }, []); // Empty dependency array to run only once

  // Debug modal state
  useEffect(() => {
    console.log('Modal state changed - isModalOpen:', isModalOpen);
  }, [isModalOpen]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Add Transaction button clicked');
    setEditingTransaction(null);
    setIsModalOpen(true);
    console.log('Modal should be open now, isModalOpen:', true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionSuccess = () => {
    // Refresh data after successful transaction operation
    loadTransactions();
    loadSummary();
  };

  const getTotalIncome = () => {
    return summary?.totalIncome || 0;
  };

  const getTotalExpenses = () => {
    return summary?.totalExpenses || 0;
  };

  const getNetWorth = () => {
    return summary?.netWorth || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transaction Management</h1>
        <button 
          className="btn-primary"
          onClick={handleAddTransaction}
        >
          + Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">{formatCurrency(getTotalIncome())}</p>
            <span className="count">{summary?.incomeCount || 0} transactions</span>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="amount">{formatCurrency(getTotalExpenses())}</p>
            <span className="count">{summary?.expenseCount || 0} transactions</span>
          </div>
        </div>

        <div className={`summary-card net-worth ${getNetWorth() >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">{getNetWorth() >= 0 ? '📈' : '📉'}</div>
          <div className="card-content">
            <h3>Net Worth</h3>
            <p className="amount">{formatCurrency(getNetWorth())}</p>
            <span className="count">Income - Expenses</span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transactions-section">
        <TransactionList
          onEdit={handleEditTransaction}
          onDelete={() => {}} // Handled in TransactionList component
        />
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
        onSuccess={handleTransactionSuccess}
      />
    </div>
  );
};

export default TransactionsPage;
