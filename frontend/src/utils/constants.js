// Application constants

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'INCOME',
  EXPENSE: 'EXPENSE'
};

// Transaction type display names
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Income',
  [TRANSACTION_TYPES.EXPENSE]: 'Expense'
};

// Common transaction categories
export const COMMON_CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investment',
    'Bonus',
    'Gift',
    'Other Income'
  ],
  EXPENSE: [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Education',
    'Travel',
    'Other Expense'
  ]
};

// Form validation rules
export const VALIDATION_RULES = {
  DESCRIPTION: {
    required: true,
    minLength: 1,
    maxLength: 255
  },
  AMOUNT: {
    required: true,
    min: 0.01
  },
  CATEGORY: {
    maxLength: 100
  },
  NOTES: {
    maxLength: 500
  }
};

// API endpoints
export const API_ENDPOINTS = {
  TRANSACTIONS: '/api/transactions',
  AUTH: '/api/auth'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy HH:mm'
};

// Currency settings
export const CURRENCY = {
  CODE: 'USD',
  SYMBOL: '$',
  LOCALE: 'en-US'
};
