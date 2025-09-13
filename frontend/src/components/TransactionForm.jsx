// Transaction Form Component for adding/editing transactions
import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS, COMMON_CATEGORIES } from '../utils/constants';

const TransactionForm = ({ transaction = null, onClose, onSuccess }) => {
  const { createTransaction, updateTransaction, loading, error } = useTransactions();
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: TRANSACTION_TYPES.EXPENSE,
    transactionDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM format
    category: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Initialize form with existing transaction data for editing
  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || TRANSACTION_TYPES.EXPENSE,
        transactionDate: transaction.transactionDate 
          ? new Date(transaction.transactionDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        category: transaction.category || '',
        notes: transaction.notes || ''
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Description validation
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 255) {
      errors.description = 'Description must not exceed 255 characters';
    }

    // Amount validation
    if (!formData.amount) {
      errors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be a positive number';
      }
    }

    // Type validation
    if (!formData.type) {
      errors.type = 'Transaction type is required';
    }

    // Date validation
    if (!formData.transactionDate) {
      errors.transactionDate = 'Transaction date is required';
    } else {
      const selectedDate = new Date(formData.transactionDate);
      const now = new Date();
      if (selectedDate > now) {
        errors.transactionDate = 'Transaction date cannot be in the future';
      }
    }

    // Category validation (optional but if provided, check length)
    if (formData.category && formData.category.length > 100) {
      errors.category = 'Category must not exceed 100 characters';
    }

    // Notes validation (optional but if provided, check length)
    if (formData.notes && formData.notes.length > 500) {
      errors.notes = 'Notes must not exceed 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      console.log('Sending transaction data:', transactionData);

      if (transaction) {
        // Update existing transaction
        console.log('Updating existing transaction');
        await updateTransaction(transaction.id, transactionData);
      } else {
        // Create new transaction
        console.log('Creating new transaction');
        await createTransaction(transactionData);
      }

      console.log('Transaction saved successfully');
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close form
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const getCategoryOptions = () => {
    const baseCategories = COMMON_CATEGORIES[formData.type] || [];
    return baseCategories;
  };

  return (
    <div className="transaction-form">
        <div className="form-header">
          <h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
          {onClose && (
            <button type="button" className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter transaction description"
                className={formErrors.description ? 'error' : ''}
              />
              {formErrors.description && (
                <span className="field-error">{formErrors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className={formErrors.amount ? 'error' : ''}
              />
              {formErrors.amount && (
                <span className="field-error">{formErrors.amount}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={formErrors.type ? 'error' : ''}
              >
                <option value="">Select type</option>
                {Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {formErrors.type && (
                <span className="field-error">{formErrors.type}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="transactionDate">Date *</label>
              <input
                type="datetime-local"
                id="transactionDate"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                className={formErrors.transactionDate ? 'error' : ''}
              />
              {formErrors.transactionDate && (
                <span className="field-error">{formErrors.transactionDate}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={formErrors.category ? 'error' : ''}
              >
                <option value="">Select category</option>
                {getCategoryOptions().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {formErrors.category && (
                <span className="field-error">{formErrors.category}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes (optional)"
              rows="3"
              className={formErrors.notes ? 'error' : ''}
            />
            {formErrors.notes && (
              <span className="field-error">{formErrors.notes}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : (transaction ? 'Update' : 'Add')} Transaction
            </button>
          </div>
        </form>
    </div>
  );
};

export default TransactionForm;
