// Currency conversion service for frontend API calls
import api from './api';

class CurrencyService {
  // Convert currency
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const requestData = {
        amount: parseFloat(amount),
        fromCurrency: fromCurrency,
        toCurrency: toCurrency
      };
      
      const response = await api.post('/currency/convert', requestData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get exchange rate between two currencies
  async getExchangeRate(fromCurrency, toCurrency) {
    try {
      const response = await api.get(`/currency/rate/${fromCurrency}/${toCurrency}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get all exchange rates for a base currency
  async getExchangeRates(baseCurrency) {
    try {
      const response = await api.get(`/currency/rates/${baseCurrency}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get supported currencies
  async getSupportedCurrencies() {
    try {
      const response = await api.get('/currency/supported');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Convert amount to multiple currencies
  async convertMultipleCurrencies(amount, fromCurrency, toCurrencies) {
    try {
      const response = await api.post('/currency/convert-multiple', null, {
        params: {
          amount: amount,
          fromCurrency: fromCurrency,
          toCurrencies: toCurrencies.join(',')
        }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get currency information
  async getCurrencyInfo(currencyCode) {
    try {
      const response = await api.get(`/currency/info/${currencyCode}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Check cache status
  async getCacheStatus() {
    try {
      const response = await api.get('/currency/cache/status');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Clear cache
  async clearCache() {
    try {
      const response = await api.delete('/currency/cache');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Helper method to format amount with currency symbol
  formatAmountWithCurrency(amount, currencyCode) {
    const currencySymbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥',
      'SEK': 'kr',
      'NZD': 'NZ$',
      'MXN': '$',
      'SGD': 'S$',
      'HKD': 'HK$',
      'NOK': 'kr',
      'TRY': '₺',
      'RUB': '₽',
      'INR': '₹',
      'BRL': 'R$',
      'ZAR': 'R',
      'KRW': '₩'
    };

    const symbol = currencySymbols[currencyCode] || currencyCode;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  }

  // Helper method to format amount for display
  formatAmount(amount, decimals = 2) {
    return parseFloat(amount).toFixed(decimals);
  }

  // Helper method to get currency name
  getCurrencyName(currencyCode) {
    const currencyNames = {
      'USD': 'US Dollar',
      'EUR': 'Euro',
      'GBP': 'British Pound',
      'JPY': 'Japanese Yen',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'CHF': 'Swiss Franc',
      'CNY': 'Chinese Yuan',
      'SEK': 'Swedish Krona',
      'NZD': 'New Zealand Dollar',
      'MXN': 'Mexican Peso',
      'SGD': 'Singapore Dollar',
      'HKD': 'Hong Kong Dollar',
      'NOK': 'Norwegian Krone',
      'TRY': 'Turkish Lira',
      'RUB': 'Russian Ruble',
      'INR': 'Indian Rupee',
      'BRL': 'Brazilian Real',
      'ZAR': 'South African Rand',
      'KRW': 'South Korean Won'
    };

    return currencyNames[currencyCode] || `${currencyCode} Currency`;
  }

  // Helper method to validate currency code
  validateCurrencyCode(currencyCode) {
    const supportedCurrencies = [
      'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD',
      'MXN', 'SGD', 'HKD', 'NOK', 'TRY', 'RUB', 'INR', 'BRL', 'ZAR', 'KRW'
    ];

    if (!currencyCode || currencyCode.length !== 3) {
      return 'Currency code must be 3 characters long';
    }

    if (!supportedCurrencies.includes(currencyCode.toUpperCase())) {
      return 'Unsupported currency code';
    }

    return null;
  }

  // Helper method to validate amount
  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
      return 'Amount must be a valid number';
    }

    if (numAmount <= 0) {
      return 'Amount must be greater than 0';
    }

    if (numAmount > 999999999) {
      return 'Amount is too large';
    }

    return null;
  }

  // Helper method to get currency flag (emoji representation)
  getCurrencyFlag(currencyCode) {
    const currencyFlags = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'CAD': '🇨🇦',
      'AUD': '🇦🇺',
      'CHF': '🇨🇭',
      'CNY': '🇨🇳',
      'SEK': '🇸🇪',
      'NZD': '🇳🇿',
      'MXN': '🇲🇽',
      'SGD': '🇸🇬',
      'HKD': '🇭🇰',
      'NOK': '🇳🇴',
      'TRY': '🇹🇷',
      'RUB': '🇷🇺',
      'INR': '🇮🇳',
      'BRL': '🇧🇷',
      'ZAR': '🇿🇦',
      'KRW': '🇰🇷'
    };

    return currencyFlags[currencyCode] || '🏳️';
  }
}

export default new CurrencyService();
