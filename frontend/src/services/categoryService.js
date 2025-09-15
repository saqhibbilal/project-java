// Category service for frontend API calls
import api from './api';

class CategoryService {
  // Create a new category
  async createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get all categories available for the current user (user's + default categories)
  async getAllCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get user's own categories only
  async getUserCategories() {
    try {
      const response = await api.get('/categories/user');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get default categories
  async getDefaultCategories() {
    try {
      const response = await api.get('/categories/default');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get a specific category by ID
  async getCategoryById(id) {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Update an existing category
  async updateCategory(id, categoryData) {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get categories with transaction counts
  async getCategoriesWithTransactionCount() {
    try {
      const response = await api.get('/categories/with-counts');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Get category statistics
  async getCategoryStatistics() {
    try {
      const response = await api.get('/categories/statistics');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Clean up unused categories
  async cleanupUnusedCategories() {
    try {
      const response = await api.delete('/categories/cleanup');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      throw new Error(errorMessage);
    }
  }

  // Helper method to format category data for API
  formatCategoryForAPI(category) {
    return {
      name: category.name,
      description: category.description || null,
      color: category.color || '#6B7280'
    };
  }

  // Helper method to format category data from API
  formatCategoryFromAPI(category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      isDefault: category.isDefault,
      transactionCount: category.transactionCount || 0,
      createdAt: category.createdAt ? new Date(category.createdAt) : null,
      updatedAt: category.updatedAt ? new Date(category.updatedAt) : null
    };
  }

  // Helper method to get category color
  getCategoryColor(category) {
    return category?.color || '#6B7280';
  }

  // Helper method to get category display name
  getCategoryDisplayName(category) {
    return category?.name || 'Uncategorized';
  }

  // Helper method to validate category name
  validateCategoryName(name) {
    if (!name || name.trim().length === 0) {
      return 'Category name is required';
    }
    if (name.trim().length > 100) {
      return 'Category name must not exceed 100 characters';
    }
    return null;
  }

  // Helper method to validate category color
  validateCategoryColor(color) {
    if (!color) return null;
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(color)) {
      return 'Color must be a valid hex color code (e.g., #FF5733)';
    }
    return null;
  }
}

export default new CategoryService();
