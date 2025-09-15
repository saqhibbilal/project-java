package com.trackspring.controller;

import com.trackspring.dto.CurrencyConversionRequest;
import com.trackspring.dto.CurrencyConversionResponse;
import com.trackspring.service.CurrencyConversionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/currency")
@CrossOrigin(origins = "http://localhost:5173")
public class CurrencyController {

    @Autowired
    private CurrencyConversionService currencyConversionService;

    // Convert currency
    @PostMapping("/convert")
    public ResponseEntity<?> convertCurrency(@Valid @RequestBody CurrencyConversionRequest request,
            Authentication authentication) {
        try {
            CurrencyConversionResponse response = currencyConversionService.convertCurrency(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get exchange rate between two currencies
    @GetMapping("/rate/{fromCurrency}/{toCurrency}")
    public ResponseEntity<?> getExchangeRate(@PathVariable String fromCurrency,
            @PathVariable String toCurrency,
            Authentication authentication) {
        try {
            BigDecimal rate = currencyConversionService.getExchangeRate(fromCurrency, toCurrency);
            return ResponseEntity.ok(Map.of(
                    "fromCurrency", fromCurrency,
                    "toCurrency", toCurrency,
                    "exchangeRate", rate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all exchange rates for a base currency
    @GetMapping("/rates/{baseCurrency}")
    public ResponseEntity<?> getExchangeRates(@PathVariable String baseCurrency,
            Authentication authentication) {
        try {
            Map<String, BigDecimal> rates = currencyConversionService.getExchangeRates(baseCurrency);
            return ResponseEntity.ok(Map.of(
                    "baseCurrency", baseCurrency,
                    "rates", rates,
                    "timestamp", System.currentTimeMillis()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get supported currencies
    @GetMapping("/supported")
    public ResponseEntity<?> getSupportedCurrencies(Authentication authentication) {
        try {
            List<String> currencies = currencyConversionService.getSupportedCurrencies();
            return ResponseEntity.ok(currencies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Convert amount to multiple currencies
    @PostMapping("/convert-multiple")
    public ResponseEntity<?> convertMultipleCurrencies(
            @RequestParam BigDecimal amount,
            @RequestParam String fromCurrency,
            @RequestParam List<String> toCurrencies,
            Authentication authentication) {
        try {
            List<CurrencyConversionResponse> responses = currencyConversionService.convertMultipleCurrencies(amount,
                    fromCurrency, toCurrencies);
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get currency information
    @GetMapping("/info/{currencyCode}")
    public ResponseEntity<?> getCurrencyInfo(@PathVariable String currencyCode,
            Authentication authentication) {
        try {
            Map<String, Object> info = currencyConversionService.getCurrencyInfo(currencyCode);
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Check cache status
    @GetMapping("/cache/status")
    public ResponseEntity<?> getCacheStatus(Authentication authentication) {
        try {
            boolean isStale = currencyConversionService.isCacheStale();
            return ResponseEntity.ok(Map.of(
                    "cacheStale", isStale,
                    "message", isStale ? "Cache is stale, will fetch fresh rates" : "Cache is fresh"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Clear cache (admin function)
    @DeleteMapping("/cache")
    public ResponseEntity<?> clearCache(Authentication authentication) {
        try {
            currencyConversionService.clearCache();
            return ResponseEntity.ok(Map.of(
                    "message", "Cache cleared successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
