// Currency Converter Component
import React, { useState, useEffect } from 'react';
import currencyService from '../services/currencyService';

const CurrencyConverter = ({ initialAmount = 0, onConvertedAmountChange }) => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(initialAmount);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load supported currencies on component mount
  useEffect(() => {
    loadSupportedCurrencies();
  }, []);

  // Convert currency when amount or currencies change
  useEffect(() => {
    if (amount > 0 && fromCurrency && toCurrency) {
      convertCurrency();
    }
  }, [amount, fromCurrency, toCurrency]);

  // Load supported currencies
  const loadSupportedCurrencies = async () => {
    try {
      const currencies = await currencyService.getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    } catch (error) {
      setError('Failed to load supported currencies');
    }
  };

  // Convert currency
  const convertCurrency = async () => {
    if (amount <= 0) {
      setConvertedAmount(0);
      setExchangeRate(0);
      return;
    }

    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      setExchangeRate(1);
      setLastUpdated(new Date());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await currencyService.convertCurrency(amount, fromCurrency, toCurrency);
      setConvertedAmount(result.convertedAmount);
      setExchangeRate(result.exchangeRate);
      setLastUpdated(new Date(result.timestamp));
      
      // Notify parent component if callback provided
      if (onConvertedAmountChange) {
        onConvertedAmountChange(result.convertedAmount, toCurrency);
      }
    } catch (error) {
      setError(error.message);
      setConvertedAmount(0);
      setExchangeRate(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
  };

  // Handle currency selection
  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Format amount with currency
  const formatAmountWithCurrency = (amount, currencyCode) => {
    return currencyService.formatAmountWithCurrency(amount, currencyCode);
  };

  // Get currency flag
  const getCurrencyFlag = (currencyCode) => {
    return currencyService.getCurrencyFlag(currencyCode);
  };

  return (
    <div className="currency-converter-modern">
      <div className="converter-card">
        <div className="converter-header">
          <div className="header-info">
            <h3>💱 Real-Time Converter</h3>
            {lastUpdated && (
              <span className="last-updated">
                🔄 Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="rate-indicator">
            <span className="live-indicator">🔴 LIVE</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="converter-form">
          <div className="amount-section">
            <label htmlFor="amount" className="form-label">
              💰 Amount to Convert
            </label>
            <div className="amount-input-wrapper">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="amount-input"
              />
              <div className="input-decoration"></div>
            </div>
          </div>

          <div className="currency-selection">
            <div className="currency-from">
              <label htmlFor="fromCurrency" className="form-label">
                📤 From Currency
              </label>
              <div className="select-wrapper">
                <select
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={handleFromCurrencyChange}
                  className="currency-select"
                >
                  {supportedCurrencies.map(currency => (
                    <option key={currency} value={currency}>
                      {getCurrencyFlag(currency)} {currency} - {currencyService.getCurrencyName(currency)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="swap-section">
              <button
                type="button"
                onClick={swapCurrencies}
                className="swap-btn"
                title="Swap currencies"
              >
                <span className="swap-icon">🔄</span>
              </button>
            </div>

            <div className="currency-to">
              <label htmlFor="toCurrency" className="form-label">
                📥 To Currency
              </label>
              <div className="select-wrapper">
                <select
                  id="toCurrency"
                  value={toCurrency}
                  onChange={handleToCurrencyChange}
                  className="currency-select"
                >
                  {supportedCurrencies.map(currency => (
                    <option key={currency} value={currency}>
                      {getCurrencyFlag(currency)} {currency} - {currencyService.getCurrencyName(currency)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="conversion-result">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>Converting...</span>
              </div>
            ) : (
              <div className="result-display">
                <div className="converted-amount">
                  <span className="amount-value">
                    {formatAmountWithCurrency(convertedAmount, toCurrency)}
                  </span>
                  <span className="currency-info">
                    {currencyService.getCurrencyName(toCurrency)}
                  </span>
                </div>
                
                {exchangeRate > 0 && fromCurrency !== toCurrency && (
                  <div className="exchange-rate-info">
                    <span className="rate-label">Exchange Rate:</span>
                    <span className="rate-value">
                      1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick conversion buttons */}
        <div className="quick-conversions">
          <h4>⚡ Quick Convert</h4>
          <div className="quick-buttons">
            {['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'].map(currency => (
              <button
                key={currency}
                className={`quick-btn ${toCurrency === currency ? 'active' : ''}`}
                onClick={() => setToCurrency(currency)}
              >
                <span className="currency-flag">{getCurrencyFlag(currency)}</span>
                <span className="currency-code">{currency}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
