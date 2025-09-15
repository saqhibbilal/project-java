package com.trackspring.service;

import com.trackspring.dto.CurrencyConversionRequest;
import com.trackspring.dto.CurrencyConversionResponse;
import com.trackspring.dto.ExchangeRatesResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CurrencyConversionService {

    private final Map<String, BigDecimal> cachedRates = new ConcurrentHashMap<>();
    private LocalDateTime lastCacheUpdate;
    private final RestTemplate restTemplate;

    @Value("${currency.api.key}")
    private String apiKey;

    @Value("${currency.api.url}")
    private String apiUrl;

    // Common currency codes
    public static final List<String> SUPPORTED_CURRENCIES = Arrays.asList(
            "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SEK", "NZD",
            "MXN", "SGD", "HKD", "NOK", "TRY", "RUB", "INR", "BRL", "ZAR", "KRW");

    public CurrencyConversionService() {
        this.restTemplate = new RestTemplate();
    }

    // Convert currency using live exchange rates
    public CurrencyConversionResponse convertCurrency(CurrencyConversionRequest request) {
        try {
            // Validate currencies
            validateCurrency(request.getFromCurrency());
            validateCurrency(request.getToCurrency());

            // If same currency, return original amount
            if (request.getFromCurrency().equals(request.getToCurrency())) {
                return new CurrencyConversionResponse(
                        request.getAmount(),
                        request.getFromCurrency(),
                        request.getAmount(),
                        request.getToCurrency(),
                        BigDecimal.ONE,
                        LocalDateTime.now(),
                        "Same Currency");
            }

            // Get exchange rates
            Map<String, BigDecimal> rates = getExchangeRates(request.getFromCurrency());

            // Get the exchange rate for target currency
            BigDecimal exchangeRate = rates.get(request.getToCurrency());
            if (exchangeRate == null) {
                throw new RuntimeException("Exchange rate not found for " + request.getToCurrency());
            }

            // Calculate converted amount
            BigDecimal convertedAmount = request.getAmount().multiply(exchangeRate)
                    .setScale(2, RoundingMode.HALF_UP);

            return new CurrencyConversionResponse(
                    request.getAmount(),
                    request.getFromCurrency(),
                    convertedAmount,
                    request.getToCurrency(),
                    exchangeRate,
                    LocalDateTime.now(),
                    "Live Rates");

        } catch (Exception e) {
            throw new RuntimeException("Currency conversion failed: " + e.getMessage());
        }
    }

    // Get exchange rates for a base currency from OpenExchange API
    @Cacheable(value = "exchangeRates", key = "#baseCurrency")
    public Map<String, BigDecimal> getExchangeRates(String baseCurrency) {
        try {
            // Validate base currency
            validateCurrency(baseCurrency);

            // Build API URL
            String url = String.format("%s/latest.json?app_id=%s&base=%s",
                    apiUrl, apiKey, baseCurrency);

            // Make API call
            ExchangeRatesResponse response = restTemplate.getForObject(url, ExchangeRatesResponse.class);

            if (response == null || response.getRates() == null) {
                throw new RuntimeException("Failed to fetch exchange rates from API");
            }

            // Get rates directly from response
            Map<String, BigDecimal> rates = response.getRates();

            // Cache the rates
            cachedRates.putAll(rates);
            lastCacheUpdate = LocalDateTime.now();

            return rates;

        } catch (Exception e) {
            // Fallback to cached rates if API fails
            if (!cachedRates.isEmpty()) {
                return new ConcurrentHashMap<>(cachedRates);
            }
            throw new RuntimeException("Error retrieving exchange rates: " + e.getMessage());
        }
    }

    // Get supported currencies
    public List<String> getSupportedCurrencies() {
        return SUPPORTED_CURRENCIES;
    }

    // Get exchange rate between two currencies
    public BigDecimal getExchangeRate(String fromCurrency, String toCurrency) {
        try {
            validateCurrency(fromCurrency);
            validateCurrency(toCurrency);

            if (fromCurrency.equals(toCurrency)) {
                return BigDecimal.ONE;
            }

            Map<String, BigDecimal> rates = getExchangeRates(fromCurrency);
            BigDecimal rate = rates.get(toCurrency);

            if (rate == null) {
                throw new RuntimeException("Exchange rate not found for " + toCurrency);
            }

            return rate;

        } catch (Exception e) {
            throw new RuntimeException("Failed to get exchange rate: " + e.getMessage());
        }
    }

    // Convert multiple amounts at once
    public List<CurrencyConversionResponse> convertMultipleCurrencies(
            BigDecimal amount, String fromCurrency, List<String> toCurrencies) {

        return toCurrencies.stream()
                .map(toCurrency -> {
                    CurrencyConversionRequest request = new CurrencyConversionRequest(
                            amount, fromCurrency, toCurrency);
                    return convertCurrency(request);
                })
                .toList();
    }

    // Get currency information (name, symbol, etc.)
    public Map<String, Object> getCurrencyInfo(String currencyCode) {
        validateCurrency(currencyCode);

        // This could be expanded to include more currency information
        return Map.of(
                "code", currencyCode,
                "name", getCurrencyName(currencyCode),
                "symbol", getCurrencySymbol(currencyCode));
    }

    // Validate currency code
    private void validateCurrency(String currency) {
        if (currency == null || currency.trim().isEmpty()) {
            throw new IllegalArgumentException("Currency code cannot be null or empty");
        }

        String upperCurrency = currency.toUpperCase().trim();
        if (upperCurrency.length() != 3) {
            throw new IllegalArgumentException("Currency code must be 3 characters long");
        }

        if (!SUPPORTED_CURRENCIES.contains(upperCurrency)) {
            throw new IllegalArgumentException("Unsupported currency: " + upperCurrency);
        }
    }

    // Get currency name (simplified mapping)
    private String getCurrencyName(String currencyCode) {
        return switch (currencyCode.toUpperCase()) {
            case "USD" -> "US Dollar";
            case "EUR" -> "Euro";
            case "GBP" -> "British Pound";
            case "JPY" -> "Japanese Yen";
            case "CAD" -> "Canadian Dollar";
            case "AUD" -> "Australian Dollar";
            case "CHF" -> "Swiss Franc";
            case "CNY" -> "Chinese Yuan";
            case "SEK" -> "Swedish Krona";
            case "NZD" -> "New Zealand Dollar";
            case "MXN" -> "Mexican Peso";
            case "SGD" -> "Singapore Dollar";
            case "HKD" -> "Hong Kong Dollar";
            case "NOK" -> "Norwegian Krone";
            case "TRY" -> "Turkish Lira";
            case "RUB" -> "Russian Ruble";
            case "INR" -> "Indian Rupee";
            case "BRL" -> "Brazilian Real";
            case "ZAR" -> "South African Rand";
            case "KRW" -> "South Korean Won";
            default -> currencyCode + " Currency";
        };
    }

    // Get currency symbol (simplified mapping)
    private String getCurrencySymbol(String currencyCode) {
        return switch (currencyCode.toUpperCase()) {
            case "USD" -> "$";
            case "EUR" -> "€";
            case "GBP" -> "£";
            case "JPY" -> "¥";
            case "CAD" -> "C$";
            case "AUD" -> "A$";
            case "CHF" -> "CHF";
            case "CNY" -> "¥";
            case "SEK" -> "kr";
            case "NZD" -> "NZ$";
            case "MXN" -> "$";
            case "SGD" -> "S$";
            case "HKD" -> "HK$";
            case "NOK" -> "kr";
            case "TRY" -> "₺";
            case "RUB" -> "₽";
            case "INR" -> "₹";
            case "BRL" -> "R$";
            case "ZAR" -> "R";
            case "KRW" -> "₩";
            default -> currencyCode;
        };
    }

    // Check if cache is stale (older than 1 hour)
    public boolean isCacheStale() {
        if (lastCacheUpdate == null) {
            return true;
        }
        return lastCacheUpdate.isBefore(LocalDateTime.now().minusHours(1));
    }

    // Clear cache
    public void clearCache() {
        cachedRates.clear();
        lastCacheUpdate = null;
    }
}
