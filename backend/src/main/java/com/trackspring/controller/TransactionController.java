package com.trackspring.controller;

import com.trackspring.dto.TransactionRequest;
import com.trackspring.dto.TransactionResponse;
import com.trackspring.entity.Transaction;
import com.trackspring.entity.TransactionType;
import com.trackspring.entity.User;
import com.trackspring.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Helper method to convert Transaction to TransactionResponse
    private TransactionResponse convertToResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getTransactionDate(),
                transaction.getCategory(),
                transaction.getNotes(),
                transaction.getCreatedAt(),
                transaction.getUpdatedAt());
    }

    // Helper method to convert TransactionRequest to Transaction
    private Transaction convertToEntity(TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setCategory(request.getCategory());
        transaction.setNotes(request.getNotes());
        return transaction;
    }

    // Get current user from authentication
    private User getCurrentUser(Authentication authentication) {
        return (User) authentication.getPrincipal();
    }

    // Create a new transaction
    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            Transaction transaction = convertToEntity(request);
            Transaction savedTransaction = transactionService.createTransaction(transaction, user);
            TransactionResponse response = convertToResponse(savedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all transactions for the current user
    @GetMapping
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transactionDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);

            Page<Transaction> transactions = transactionService.getAllTransactionsByUser(user, pageable);
            Page<TransactionResponse> responses = transactions.map(this::convertToResponse);

            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get a specific transaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id, Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            return transactionService.getTransactionById(id, user)
                    .map(transaction -> ResponseEntity.ok(convertToResponse(transaction)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update an existing transaction
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            Transaction transaction = convertToEntity(request);
            Transaction updatedTransaction = transactionService.updateTransaction(id, transaction, user);
            TransactionResponse response = convertToResponse(updatedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            transactionService.deleteTransaction(id, user);
            return ResponseEntity.ok().body("Transaction deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get transactions by type
    @GetMapping("/type/{type}")
    public ResponseEntity<?> getTransactionsByType(@PathVariable TransactionType type,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<Transaction> transactions = transactionService.getTransactionsByType(user, type);
            List<TransactionResponse> responses = transactions.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get transactions by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getTransactionsByCategory(@PathVariable String category,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<Transaction> transactions = transactionService.getTransactionsByCategory(user, category);
            List<TransactionResponse> responses = transactions.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get recent transactions (last 10)
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentTransactions(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<Transaction> transactions = transactionService.getRecentTransactions(user);
            List<TransactionResponse> responses = transactions.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all distinct categories for the user
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<String> categories = transactionService.getDistinctCategoriesByUser(user);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get summary statistics
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            BigDecimal totalIncome = transactionService.getTotalAmountByType(user, TransactionType.INCOME);
            BigDecimal totalExpenses = transactionService.getTotalAmountByType(user, TransactionType.EXPENSE);
            BigDecimal netWorth = transactionService.getNetWorth(user);
            long incomeCount = transactionService.getTransactionCountByType(user, TransactionType.INCOME);
            long expenseCount = transactionService.getTransactionCountByType(user, TransactionType.EXPENSE);

            return ResponseEntity.ok(new SummaryResponse(
                    totalIncome, totalExpenses, netWorth, incomeCount, expenseCount));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inner class for summary response
    public static class SummaryResponse {
        private BigDecimal totalIncome;
        private BigDecimal totalExpenses;
        private BigDecimal netWorth;
        private long incomeCount;
        private long expenseCount;

        public SummaryResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal netWorth,
                long incomeCount, long expenseCount) {
            this.totalIncome = totalIncome;
            this.totalExpenses = totalExpenses;
            this.netWorth = netWorth;
            this.incomeCount = incomeCount;
            this.expenseCount = expenseCount;
        }

        // Getters
        public BigDecimal getTotalIncome() {
            return totalIncome;
        }

        public BigDecimal getTotalExpenses() {
            return totalExpenses;
        }

        public BigDecimal getNetWorth() {
            return netWorth;
        }

        public long getIncomeCount() {
            return incomeCount;
        }

        public long getExpenseCount() {
            return expenseCount;
        }
    }
}
