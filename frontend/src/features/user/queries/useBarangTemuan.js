import { useQuery } from "@tanstack/react-query";
import { barangTemuanApi } from "../api/barangTemuanApi";

/**
 * Query keys for barang temuan
 */
export const barangTemuanKeys = {
  all: ["barang-temuan"],
  lists: () => [...barangTemuanKeys.all, "list"],
  list: (filters) => [...barangTemuanKeys.lists(), filters],
  details: () => [...barangTemuanKeys.all, "detail"],
  detail: (id) => [...barangTemuanKeys.details(), id],
  categories: () => [...barangTemuanKeys.all, "categories"],
};

/**
 * Hook to fetch list of barang temuan
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useBarangTemuanList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: barangTemuanKeys.list(params),
    queryFn: async () => {
      const response = await barangTemuanApi.getList(params);
      return response.data; // Extract data from axios response
    },
    ...options,
  });
};

/**
 * Hook to fetch barang temuan detail
 * @param {string} id - Barang ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useBarangTemuanDetail = (id, options = {}) => {
  return useQuery({
    queryKey: barangTemuanKeys.detail(id),
    queryFn: async () => {
      const response = await barangTemuanApi.getById(id);
      // Backend returns { data: barang }, axios wraps it in response.data
      // So response.data.data gives us the actual barang object
      return response.data.data;
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch categories
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: barangTemuanKeys.categories(),
    queryFn: async () => {
      const response = await barangTemuanApi.getCategories();
      return response.data.data; // Extract data.data from axios response (axios returns {data: {data: [...]}})
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
