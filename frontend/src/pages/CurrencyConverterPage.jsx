// Currency Converter Page
import React from 'react';
import CurrencyConverter from '../components/CurrencyConverter';

const CurrencyConverterPage = () => {
  return (
    <div className="currency-page">
      <div className="page-header">
        <div className="header-content">
          <h1>💱 Currency Converter</h1>
          <p>Convert between different currencies using real-time exchange rates from OpenExchange</p>
          <div className="header-badges">
            <span className="badge live">🔴 Live Rates</span>
            <span className="badge secure">🔒 Secure</span>
            <span className="badge fast">⚡ Fast</span>
          </div>
        </div>
      </div>
      
      <div className="converter-container">
        <CurrencyConverter />
      </div>
    </div>
  );
};

export default CurrencyConverterPage;
