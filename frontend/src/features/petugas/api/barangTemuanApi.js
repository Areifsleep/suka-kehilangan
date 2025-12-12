import { api } from "@/lib/axios";

/**
 * Petugas Barang Temuan API
 * Endpoint untuk petugas mengelola barang temuan
 */
export const petugasBarangTemuanApi = {
  /**
   * Create new barang temuan
   * @param {Object} data - Barang data
   * @param {Array} files - Array of image files (foto_barang)
   * @returns {Promise}
   */
  create: (data, files) => {
    const formData = new FormData();

    // Append barang data
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });

    // Append foto_barang files (1-5 files required)
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("foto_barang", file);
      });
    }

    return api.post("/barang-temuan", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update barang temuan
   * @param {string} id - Barang ID
   * @param {Object} data - Updated data
   * @param {Array} files - Optional new photos
   * @returns {Promise}
   */
  update: (id, data, files = []) => {
    const formData = new FormData();

    // Append updated data
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });

    // Append new photos if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("foto_barang", file);
      });
    }

    return api.put(`/barang-temuan/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Mark barang as SUDAH_DIAMBIL
   * @param {string} id - Barang ID
   * @param {Object} data - Claim data
   * @param {string} data.nama_pengambil
   * @param {string} data.identitas_pengambil
   * @param {string} data.kontak_pengambil
   * @param {string} data.keterangan_klaim
   * @param {Array} files - Optional foto_bukti_klaim (0-3 files)
   * @returns {Promise}
   */
  markDiambil: (id, data, files = []) => {
    const formData = new FormData();

    // Append claim data
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
        formData.append(key, data[key]);
      }
    });

    // Append foto_bukti_klaim if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("foto_bukti_klaim", file);
      });
    }

    return api.post(`/barang-temuan/${id}/diambil`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Delete barang temuan
   * @param {string} id - Barang ID
   * @returns {Promise}
   */
  delete: (id) => {
    return api.delete(`/barang-temuan/${id}`);
  },

  /**
   * Get list barang temuan (petugas can see all status)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getList: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.kategori_id)
      queryParams.append("kategori_id", params.kategori_id);
    if (params.sort) queryParams.append("sort", params.sort);
    if (params.order) queryParams.append("order", params.order);

    return api.get(`/barang-temuan?${queryParams.toString()}`);
  },

  /**
   * Get barang detail
   * @param {string} id - Barang ID
   * @returns {Promise}
   */
  getById: (id) => {
    return api.get(`/barang-temuan/${id}`);
  },

  /**
   * Get petugas statistics
   * @returns {Promise}
   */
  getMyStats: () => {
    return api.get("/barang-temuan/stats/my-stats");
  },

  /**
   * Get categories
   * @returns {Promise}
   */
  getCategories: () => {
    return api.get("/kategori");
  },
};
