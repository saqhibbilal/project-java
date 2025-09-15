// Transaction Context for global state management
import { createContext, useContext, useState, useEffect } from 'react';
import transactionService from '../services/transactionService';

// Create the context
const TransactionContext = createContext();

// Custom hook to use the transaction context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Transaction Provider component
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);

  // Load all transactions
  const loadTransactions = async (page = 0, size = 10, sortBy = 'transactionDate', sortDir = 'desc') => {
    setLoading(true);
    setError(null);
    try {
      const response = await transactionService.getAllTransactions(page, size, sortBy, sortDir);
      setTransactions(response.content || response);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load recent transactions
  const loadRecentTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const recentTransactions = await transactionService.getRecentTransactions();
      setTransactions(recentTransactions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load summary statistics
  const loadSummary = async () => {
    try {
      const summaryData = await transactionService.getSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      console.log('Loading categories in context...');
      const categoriesData = await transactionService.getCategories();
      console.log('Categories loaded in context:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Create a new transaction
  const createTransaction = async (transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const formattedData = transactionService.formatTransactionForAPI(transactionData);
      const newTransaction = await transactionService.createTransaction(formattedData);
      const formattedTransaction = transactionService.formatTransactionFromAPI(newTransaction);
      
      // Add to the beginning of the list
      setTransactions(prev => [formattedTransaction, ...prev]);
      
      // Reload summary to update totals
      await loadSummary();
      
      // Reload categories to include new category
      await loadCategories();
      
      return formattedTransaction;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id, transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const formattedData = transactionService.formatTransactionForAPI(transactionData);
      const updatedTransaction = await transactionService.updateTransaction(id, formattedData);
      const formattedTransaction = transactionService.formatTransactionFromAPI(updatedTransaction);
      
      // Update in the list
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === id ? formattedTransaction : transaction
        )
      );
      
      // Reload summary to update totals
      await loadSummary();
      
      // Reload categories to include new category
      await loadCategories();
      
      return formattedTransaction;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.deleteTransaction(id);
      
      // Remove from the list
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      
      // Reload summary to update totals
      await loadSummary();
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get transactions by type
  const getTransactionsByType = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const transactionsByType = await transactionService.getTransactionsByType(type);
      const formattedTransactions = transactionsByType.map(transactionService.formatTransactionFromAPI);
      setTransactions(formattedTransactions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get transactions by category
  const getTransactionsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const transactionsByCategory = await transactionService.getTransactionsByCategory(category);
      const formattedTransactions = transactionsByCategory.map(transactionService.formatTransactionFromAPI);
      setTransactions(formattedTransactions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Clear transactions
  const clearTransactions = () => {
    setTransactions([]);
  };

  const value = {
    // State
    transactions,
    loading,
    error,
    summary,
    categories,
    
    // Actions
    loadTransactions,
    loadRecentTransactions,
    loadSummary,
    loadCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByType,
    getTransactionsByCategory,
    clearError,
    clearTransactions
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
