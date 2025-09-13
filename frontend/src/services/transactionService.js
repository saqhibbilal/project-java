// Transaction service for frontend API calls
import api from './api';

class TransactionService {
  // Create a new transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get all transactions with pagination
  async getAllTransactions(page = 0, size = 10, sortBy = 'transactionDate', sortDir = 'desc') {
    try {
      const response = await api.get('/transactions', {
        params: { page, size, sortBy, sortDir }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get a specific transaction by ID
  async getTransactionById(id) {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Update an existing transaction
  async updateTransaction(id, transactionData) {
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Delete a transaction
  async deleteTransaction(id) {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get transactions by type (INCOME or EXPENSE)
  async getTransactionsByType(type) {
    try {
      const response = await api.get(`/transactions/type/${type}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get transactions by category
  async getTransactionsByCategory(category) {
    try {
      const response = await api.get(`/transactions/category/${category}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get recent transactions (last 10)
  async getRecentTransactions() {
    try {
      const response = await api.get('/transactions/recent');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get all distinct categories
  async getCategories() {
    try {
      const response = await api.get('/transactions/categories');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get summary statistics
  async getSummary() {
    try {
      const response = await api.get('/transactions/summary');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Helper method to format transaction data for API
  formatTransactionForAPI(transaction) {
    return {
      description: transaction.description,
      amount: parseFloat(transaction.amount),
      type: transaction.type,
      transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate).toISOString() : null,
      category: transaction.category || null,
      notes: transaction.notes || null
    };
  }

  // Helper method to format transaction data from API
  formatTransactionFromAPI(transaction) {
    return {
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      transactionDate: transaction.transactionDate ? new Date(transaction.transactionDate) : null,
      category: transaction.category,
      notes: transaction.notes,
      createdAt: transaction.createdAt ? new Date(transaction.createdAt) : null,
      updatedAt: transaction.updatedAt ? new Date(transaction.updatedAt) : null
    };
  }

  // Helper method to format amount for display
  formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Helper method to format date for display
  formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper method to format date and time for display
  formatDateTime(date) {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default new TransactionService();
