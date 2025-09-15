// Enhanced Transaction Form with Category Management and Currency Conversion
import React, { useState, useEffect } from 'react';
import CurrencyConverter from './CurrencyConverter';
import categoryService from '../services/categoryService';
import currencyService from '../services/currencyService';

const EnhancedTransactionForm = ({ 
  transaction = null, 
  onSubmit, 
  onCancel,
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    category: '',
    notes: '',
    transactionDate: new Date().toISOString().slice(0, 16),
    currency: 'USD'
  });

  const [categories, setCategories] = useState([]);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [convertedCurrency, setConvertedCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && transaction) {
      setFormData({
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || 'EXPENSE',
        category: transaction.category || '',
        notes: transaction.notes || '',
        transactionDate: transaction.transactionDate 
          ? new Date(transaction.transactionDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        currency: 'USD' // Default currency
      });
    }
  }, [transaction, isEditing]);

  // Load categories and currencies on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [categoriesData, currenciesData] = await Promise.all([
        categoryService.getAllCategories(),
        currencyService.getSupportedCurrencies()
      ]);
      
      const formattedCategories = categoriesData.map(categoryService.formatCategoryFromAPI);
      setCategories(formattedCategories);
      setSupportedCurrencies(currenciesData);
    } catch (error) {
      setError('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  // Handle currency conversion
  const handleCurrencyConversion = (amount, currency) => {
    setConvertedAmount(amount);
    setConvertedCurrency(currency);
    setShowCurrencyConverter(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    if (!formData.category.trim()) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use converted amount if currency conversion was performed
      const finalAmount = convertedAmount || formData.amount;
      
      const transactionData = {
        ...formData,
        amount: finalAmount,
        currency: convertedCurrency || formData.currency
      };

      await onSubmit(transactionData);
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        category: '',
        notes: '',
        transactionDate: new Date().toISOString().slice(0, 16),
        currency: 'USD'
      });
      setConvertedAmount(null);
      setConvertedCurrency('USD');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get selected category object
  const selectedCategory = categories.find(cat => cat.name === formData.category);

  return (
    <div className="enhanced-transaction-form">
      <div className="form-header">
        <h3>{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowCurrencyConverter(true)}
          >
            Currency Converter
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter transaction description"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount *</label>
            <div className="amount-input-group">
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="currency-select"
              >
                {supportedCurrencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            
            {convertedAmount && (
              <div className="converted-amount-display">
                Converted: {currencyService.formatAmountWithCurrency(convertedAmount, convertedCurrency)}
              </div>
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
              onChange={handleInputChange}
              required
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <div className="category-input-group">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCategory && (
              <div className="selected-category">
                <span 
                  className="category-color-indicator"
                  style={{ backgroundColor: selectedCategory.color }}
                ></span>
                <span className="category-info">
                  {selectedCategory.name}
                  {selectedCategory.description && ` - ${selectedCategory.description}`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="transactionDate">Date *</label>
            <input
              type="datetime-local"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes (optional)"
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Transaction' : 'Add Transaction')}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>


      {/* Currency Converter Modal */}
      {showCurrencyConverter && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CurrencyConverter 
              initialAmount={formData.amount}
              onConvertedAmountChange={handleCurrencyConversion}
            />
            <button
              className="modal-close"
              onClick={() => setShowCurrencyConverter(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTransactionForm;
