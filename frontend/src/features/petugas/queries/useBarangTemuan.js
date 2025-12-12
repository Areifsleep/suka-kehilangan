import { useQuery } from "@tanstack/react-query";
import { petugasBarangTemuanApi } from "../api/barangTemuanApi";

/**
 * Query keys for petugas barang temuan
 */
export const petugasBarangTemuanKeys = {
  all: ["petugas-barang-temuan"],
  lists: () => [...petugasBarangTemuanKeys.all, "list"],
  list: (filters) => [...petugasBarangTemuanKeys.lists(), filters],
  details: () => [...petugasBarangTemuanKeys.all, "detail"],
  detail: (id) => [...petugasBarangTemuanKeys.details(), id],
  stats: () => [...petugasBarangTemuanKeys.all, "stats"],
  categories: () => [...petugasBarangTemuanKeys.all, "categories"],
};

/**
 * Hook to fetch list of barang temuan for petugas
 * @param {Object} params - Query parameters
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const usePetugasBarangTemuanList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: petugasBarangTemuanKeys.list(params),
    queryFn: async () => {
      const response = await petugasBarangTemuanApi.getList(params);
      return response.data; // Extract data from axios response
    },
    ...options,
  });
};

/**
 * Hook to fetch barang temuan detail for petugas
 * @param {string} id - Barang ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const usePetugasBarangTemuanDetail = (id, options = {}) => {
  return useQuery({
    queryKey: petugasBarangTemuanKeys.detail(id),
    queryFn: async () => {
      const response = await petugasBarangTemuanApi.getById(id);
      return response.data; // Extract data from axios response
    },
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to fetch petugas statistics
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const usePetugasStats = (options = {}) => {
  return useQuery({
    queryKey: petugasBarangTemuanKeys.stats(),
    queryFn: async () => {
      const response = await petugasBarangTemuanApi.getMyStats();
      return response.data; // Extract data from axios response
    },
    ...options,
  });
};

/**
 * Hook to fetch categories for petugas
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const usePetugasCategories = (options = {}) => {
  return useQuery({
    queryKey: petugasBarangTemuanKeys.categories(),
    queryFn: async () => {
      const response = await petugasBarangTemuanApi.getCategories();
      return response.data.data; // Extract data.data from axios response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
