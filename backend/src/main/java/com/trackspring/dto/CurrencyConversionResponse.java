package com.trackspring.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CurrencyConversionResponse {

    private BigDecimal originalAmount;
    private String fromCurrency;
    private BigDecimal convertedAmount;
    private String toCurrency;
    private BigDecimal exchangeRate;
    private LocalDateTime timestamp;
    private String source; // API source (e.g., "OpenExchangeRates")

    // Default constructor
    public CurrencyConversionResponse() {
    }

    // Constructor with all fields
    public CurrencyConversionResponse(BigDecimal originalAmount, String fromCurrency,
            BigDecimal convertedAmount, String toCurrency,
            BigDecimal exchangeRate, LocalDateTime timestamp,
            String source) {
        this.originalAmount = originalAmount;
        this.fromCurrency = fromCurrency;
        this.convertedAmount = convertedAmount;
        this.toCurrency = toCurrency;
        this.exchangeRate = exchangeRate;
        this.timestamp = timestamp;
        this.source = source;
    }

    // Getters and Setters
    public BigDecimal getOriginalAmount() {
        return originalAmount;
    }

    public void setOriginalAmount(BigDecimal originalAmount) {
        this.originalAmount = originalAmount;
    }

    public String getFromCurrency() {
        return fromCurrency;
    }

    public void setFromCurrency(String fromCurrency) {
        this.fromCurrency = fromCurrency;
    }

    public BigDecimal getConvertedAmount() {
        return convertedAmount;
    }

    public void setConvertedAmount(BigDecimal convertedAmount) {
        this.convertedAmount = convertedAmount;
    }

    public String getToCurrency() {
        return toCurrency;
    }

    public void setToCurrency(String toCurrency) {
        this.toCurrency = toCurrency;
    }

    public BigDecimal getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(BigDecimal exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    @Override
    public String toString() {
        return "CurrencyConversionResponse{" +
                "originalAmount=" + originalAmount +
                ", fromCurrency='" + fromCurrency + '\'' +
                ", convertedAmount=" + convertedAmount +
                ", toCurrency='" + toCurrency + '\'' +
                ", exchangeRate=" + exchangeRate +
                ", timestamp=" + timestamp +
                ", source='" + source + '\'' +
                '}';
    }
}
