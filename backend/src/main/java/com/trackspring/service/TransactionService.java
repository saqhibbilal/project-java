package com.trackspring.service;

import com.trackspring.entity.Transaction;
import com.trackspring.entity.TransactionType;
import com.trackspring.entity.User;
import com.trackspring.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Create a new transaction
    public Transaction createTransaction(Transaction transaction, User user) {
        // Set the user for the transaction
        transaction.setUser(user);

        // Set transaction date if not provided
        if (transaction.getTransactionDate() == null) {
            transaction.setTransactionDate(LocalDateTime.now());
        }

        // Validate business rules
        validateTransaction(transaction);

        return transactionRepository.save(transaction);
    }

    // Get all transactions for a user
    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactionsByUser(User user) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user);
    }

    // Get all transactions for a user with pagination
    @Transactional(readOnly = true)
    public Page<Transaction> getAllTransactionsByUser(User user, Pageable pageable) {
        return transactionRepository.findByUserOrderByTransactionDateDesc(user, pageable);
    }

    // Get a specific transaction by ID (only if it belongs to the user)
    @Transactional(readOnly = true)
    public Optional<Transaction> getTransactionById(Long id, User user) {
        return transactionRepository.findById(id)
                .filter(transaction -> transaction.getUser().getId().equals(user.getId()));
    }

    // Update an existing transaction
    public Transaction updateTransaction(Long id, Transaction updatedTransaction, User user) {
        // Check if transaction exists and belongs to user
        Transaction existingTransaction = transactionRepository.findById(id)
                .filter(transaction -> transaction.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Transaction not found or access denied"));

        // Update fields
        existingTransaction.setDescription(updatedTransaction.getDescription());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setType(updatedTransaction.getType());
        existingTransaction.setTransactionDate(updatedTransaction.getTransactionDate());
        existingTransaction.setCategory(updatedTransaction.getCategory());
        existingTransaction.setNotes(updatedTransaction.getNotes());

        // Validate business rules
        validateTransaction(existingTransaction);

        return transactionRepository.save(existingTransaction);
    }

    // Delete a transaction
    public void deleteTransaction(Long id, User user) {
        // Check if transaction exists and belongs to user
        if (!transactionRepository.existsByIdAndUser(id, user)) {
            throw new RuntimeException("Transaction not found or access denied");
        }

        transactionRepository.deleteById(id);
    }

    // Get transactions by type for a user
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByType(User user, TransactionType type) {
        return transactionRepository.findByUserAndTypeOrderByTransactionDateDesc(user, type);
    }

    // Get transactions by category for a user
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByCategory(User user, String category) {
        return transactionRepository.findByUserAndCategoryOrderByTransactionDateDesc(user, category);
    }

    // Get transactions within a date range for a user
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(user, startDate,
                endDate);
    }

    // Get transactions by type and date range for a user
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByTypeAndDateRange(User user, TransactionType type,
            LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.findByUserAndTypeAndTransactionDateBetweenOrderByTransactionDateDesc(user, type,
                startDate, endDate);
    }

    // Calculate total amount by type for a user
    @Transactional(readOnly = true)
    public BigDecimal getTotalAmountByType(User user, TransactionType type) {
        return transactionRepository.getTotalAmountByUserAndType(user, type);
    }

    // Calculate total amount by type for a user within date range
    @Transactional(readOnly = true)
    public BigDecimal getTotalAmountByTypeAndDateRange(User user, TransactionType type,
            LocalDateTime startDate, LocalDateTime endDate) {
        return transactionRepository.getTotalAmountByUserAndTypeAndDateRange(user, type, startDate, endDate);
    }

    // Get all distinct categories for a user
    @Transactional(readOnly = true)
    public List<String> getDistinctCategoriesByUser(User user) {
        return transactionRepository.findDistinctCategoriesByUser(user);
    }

    // Get recent transactions for a user (last 10)
    @Transactional(readOnly = true)
    public List<Transaction> getRecentTransactions(User user) {
        return transactionRepository.findTop10ByUserOrderByTransactionDateDesc(user);
    }

    // Get transaction count by type for a user
    @Transactional(readOnly = true)
    public long getTransactionCountByType(User user, TransactionType type) {
        return transactionRepository.countByUserAndType(user, type);
    }

    // Calculate net worth (income - expenses) for a user
    @Transactional(readOnly = true)
    public BigDecimal getNetWorth(User user) {
        BigDecimal totalIncome = getTotalAmountByType(user, TransactionType.INCOME);
        BigDecimal totalExpenses = getTotalAmountByType(user, TransactionType.EXPENSE);
        return totalIncome.subtract(totalExpenses);
    }

    // Calculate net worth for a user within date range
    @Transactional(readOnly = true)
    public BigDecimal getNetWorthByDateRange(User user, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal totalIncome = getTotalAmountByTypeAndDateRange(user, TransactionType.INCOME, startDate, endDate);
        BigDecimal totalExpenses = getTotalAmountByTypeAndDateRange(user, TransactionType.EXPENSE, startDate, endDate);
        return totalIncome.subtract(totalExpenses);
    }

    // Private method to validate transaction business rules
    private void validateTransaction(Transaction transaction) {
        // Amount must be positive
        if (transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transaction amount must be greater than 0");
        }

        // Description cannot be empty
        if (transaction.getDescription() == null || transaction.getDescription().trim().isEmpty()) {
            throw new RuntimeException("Transaction description is required");
        }

        // Type must be specified
        if (transaction.getType() == null) {
            throw new RuntimeException("Transaction type is required");
        }

        // Transaction date cannot be in the future (optional business rule)
        if (transaction.getTransactionDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Transaction date cannot be in the future");
        }
    }
}
