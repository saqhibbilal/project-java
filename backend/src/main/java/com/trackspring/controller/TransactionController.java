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
import java.util.Map;
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
            System.out.println("Creating transaction for user: " + user.getUsername());
            System.out.println("Transaction request: " + request);

            Transaction transaction = convertToEntity(request);
            System.out.println("Converted transaction category: '" + transaction.getCategory() + "'");

            Transaction savedTransaction = transactionService.createTransaction(transaction, user);
            System.out.println("Saved transaction category: '" + savedTransaction.getCategory() + "'");

            TransactionResponse response = convertToResponse(savedTransaction);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating transaction: " + e.getMessage());
            e.printStackTrace();
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
            System.out.println("Getting categories for user: " + user.getUsername());

            // First, let's get all transactions for this user to debug
            List<Transaction> allTransactions = transactionService.getAllTransactionsByUser(user);
            System.out.println("Total transactions for user: " + allTransactions.size());

            for (Transaction t : allTransactions) {
                System.out.println("Transaction: " + t.getDescription() + ", Category: '" + t.getCategory() + "'");
            }

            List<String> categories = transactionService.getDistinctCategoriesByUser(user);
            System.out.println("Distinct categories found: " + categories);

            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            System.err.println("Error getting categories: " + e.getMessage());
            e.printStackTrace();
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

    // Get transactions by date range
    @GetMapping("/date-range")
    public ResponseEntity<?> getTransactionsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            // Parse dates (assuming ISO format: yyyy-MM-ddTHH:mm:ss)
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);

            List<Transaction> transactions = transactionService.getTransactionsByDateRange(user, start, end);
            List<TransactionResponse> responses = transactions.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get transactions by type and date range
    @GetMapping("/type/{type}/date-range")
    public ResponseEntity<?> getTransactionsByTypeAndDateRange(
            @PathVariable TransactionType type,
            @RequestParam String startDate,
            @RequestParam String endDate,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);

            List<Transaction> transactions = transactionService.getTransactionsByTypeAndDateRange(user, type, start,
                    end);
            List<TransactionResponse> responses = transactions.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get category-wise expense summary
    @GetMapping("/analytics/category-summary")
    public ResponseEntity<?> getCategorySummary(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            // Get all transactions for the user
            List<Transaction> allTransactions = transactionService.getAllTransactionsByUser(user);

            // Group by category and calculate totals
            Map<String, CategorySummary> categorySummaries = allTransactions.stream()
                    .filter(t -> t.getCategory() != null && !t.getCategory().trim().isEmpty())
                    .collect(Collectors.groupingBy(
                            Transaction::getCategory,
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    transactions -> {
                                        BigDecimal totalAmount = transactions.stream()
                                                .map(Transaction::getAmount)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        long transactionCount = transactions.size();

                                        BigDecimal incomeAmount = transactions.stream()
                                                .filter(t -> t.getType() == TransactionType.INCOME)
                                                .map(Transaction::getAmount)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        BigDecimal expenseAmount = transactions.stream()
                                                .filter(t -> t.getType() == TransactionType.EXPENSE)
                                                .map(Transaction::getAmount)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        return new CategorySummary(
                                                transactions.get(0).getCategory(),
                                                totalAmount,
                                                transactionCount,
                                                incomeAmount,
                                                expenseAmount);
                                    })));

            return ResponseEntity.ok(categorySummaries.values());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get monthly expense trends
    @GetMapping("/analytics/monthly-trends")
    public ResponseEntity<?> getMonthlyTrends(
            @RequestParam(defaultValue = "12") int months,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            List<Transaction> allTransactions = transactionService.getAllTransactionsByUser(user);

            // Group by year-month and calculate totals
            Map<String, MonthlyTrend> monthlyTrends = allTransactions.stream()
                    .collect(Collectors.groupingBy(
                            transaction -> transaction.getTransactionDate().toLocalDate().withDayOfMonth(1).toString(),
                            Collectors.collectingAndThen(
                                    Collectors.toList(),
                                    transactions -> {
                                        BigDecimal income = transactions.stream()
                                                .filter(t -> t.getType() == TransactionType.INCOME)
                                                .map(Transaction::getAmount)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        BigDecimal expenses = transactions.stream()
                                                .filter(t -> t.getType() == TransactionType.EXPENSE)
                                                .map(Transaction::getAmount)
                                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                                        long transactionCount = transactions.size();

                                        return new MonthlyTrend(
                                                transactions.get(0).getTransactionDate().toLocalDate().withDayOfMonth(1)
                                                        .toString(),
                                                income,
                                                expenses,
                                                transactionCount);
                                    })));

            return ResponseEntity.ok(monthlyTrends.values());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Inner classes for analytics responses
    public static class CategorySummary {
        private String category;
        private BigDecimal totalAmount;
        private long transactionCount;
        private BigDecimal incomeAmount;
        private BigDecimal expenseAmount;

        public CategorySummary(String category, BigDecimal totalAmount, long transactionCount,
                BigDecimal incomeAmount, BigDecimal expenseAmount) {
            this.category = category;
            this.totalAmount = totalAmount;
            this.transactionCount = transactionCount;
            this.incomeAmount = incomeAmount;
            this.expenseAmount = expenseAmount;
        }

        // Getters
        public String getCategory() {
            return category;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public long getTransactionCount() {
            return transactionCount;
        }

        public BigDecimal getIncomeAmount() {
            return incomeAmount;
        }

        public BigDecimal getExpenseAmount() {
            return expenseAmount;
        }
    }

    public static class MonthlyTrend {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
        private long transactionCount;

        public MonthlyTrend(String month, BigDecimal income, BigDecimal expenses, long transactionCount) {
            this.month = month;
            this.income = income;
            this.expenses = expenses;
            this.transactionCount = transactionCount;
        }

        // Getters
        public String getMonth() {
            return month;
        }

        public BigDecimal getIncome() {
            return income;
        }

        public BigDecimal getExpenses() {
            return expenses;
        }

        public long getTransactionCount() {
            return transactionCount;
        }
    }
}
