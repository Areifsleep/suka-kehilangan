import { api } from "@/lib/axios";

/**
 * Barang Temuan API
 * Endpoint untuk user melihat barang-barang yang ditemukan
 */
export const barangTemuanApi = {
  /**
   * Get list barang temuan
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search keyword
   * @param {string} params.kategori_id - Filter by category
   * @param {string} params.lokasi - Filter by location
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc/desc)
   * @returns {Promise} List of barang temuan
   */
  getList: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.kategori_id)
      queryParams.append("kategori_id", params.kategori_id);
    if (params.lokasi) queryParams.append("lokasi", params.lokasi);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    return api.get(`/barang-temuan?${queryParams.toString()}`);
  },

  /**
   * Get barang temuan by ID
   * @param {string} id - Barang ID
   * @returns {Promise} Barang detail
   */
  getById: (id) => {
    return api.get(`/barang-temuan/${id}`);
  },

  /**
   * Get categories for filter
   * @returns {Promise} List of categories
   */
  getCategories: () => {
    return api.get("/kategori");
  },
};
