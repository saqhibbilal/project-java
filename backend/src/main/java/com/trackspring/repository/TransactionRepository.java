package com.trackspring.repository;

import com.trackspring.entity.Transaction;
import com.trackspring.entity.TransactionType;
import com.trackspring.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find all transactions for a specific user
    List<Transaction> findByUserOrderByTransactionDateDesc(User user);

    // Find all transactions for a specific user with pagination
    Page<Transaction> findByUserOrderByTransactionDateDesc(User user, Pageable pageable);

    // Find transactions by user and type
    List<Transaction> findByUserAndTypeOrderByTransactionDateDesc(User user, TransactionType type);

    // Find transactions by user and category
    List<Transaction> findByUserAndCategoryOrderByTransactionDateDesc(User user, String category);

    // Find transactions by user within a date range
    List<Transaction> findByUserAndTransactionDateBetweenOrderByTransactionDateDesc(
            User user, LocalDateTime startDate, LocalDateTime endDate);

    // Find transactions by user, type, and date range
    List<Transaction> findByUserAndTypeAndTransactionDateBetweenOrderByTransactionDateDesc(
            User user, TransactionType type, LocalDateTime startDate, LocalDateTime endDate);

    // Calculate total amount by type for a user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal getTotalAmountByUserAndType(@Param("user") User user, @Param("type") TransactionType type);

    // Calculate total amount by type for a user within date range
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByUserAndTypeAndDateRange(
            @Param("user") User user,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    // Get distinct categories for a user
    @Query("SELECT DISTINCT t.category FROM Transaction t WHERE t.user = :user AND t.category IS NOT NULL ORDER BY t.category")
    List<String> findDistinctCategoriesByUser(@Param("user") User user);

    // Get recent transactions for a user (last 10)
    List<Transaction> findTop10ByUserOrderByTransactionDateDesc(User user);

    // Count transactions by user and type
    long countByUserAndType(User user, TransactionType type);

    // Check if transaction belongs to user (for security)
    boolean existsByIdAndUser(Long id, User user);
}
