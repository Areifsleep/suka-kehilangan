import { api } from "@/lib/axios";

/**
 * Kategori API Service
 * Admin-only endpoints untuk manajemen kategori
 */
export const kategoriApi = {
  /**
   * Get all categories with optional pagination
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.limit] - Items per page
   * @param {string} [params.search] - Search term
   * @returns {Promise}
   */
  getAll: (params = {}) => {
    return api.get("/kategori", { params });
  },

  /**
   * Get category by ID
   * @param {string} id - Category ID
   * @returns {Promise}
   */
  getById: (id) => {
    return api.get(`/kategori/${id}`);
  },

  /**
   * Create new category
   * @param {Object} data - Category data
   * @param {string} data.nama - Category name
   * @param {string} [data.deskripsi] - Category description
   * @returns {Promise}
   */
  create: (data) => {
    return api.post("/kategori", data);
  },

  /**
   * Update category
   * @param {string} id - Category ID
   * @param {Object} data - Updated data
   * @returns {Promise}
   */
  update: (id, data) => {
    return api.put(`/kategori/${id}`, data);
  },

  /**
   * Delete category
   * @param {string} id - Category ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/kategori/${id}`);
  },
};
