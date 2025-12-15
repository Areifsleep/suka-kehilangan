import { useQuery } from "@tanstack/react-query";
import { kategoriApi } from "../api/kategoriApi";

/**
 * Query keys for kategori
 */
export const kategoriKeys = {
  all: ["kategori"],
  lists: () => [...kategoriKeys.all, "list"],
  list: (params) => [...kategoriKeys.lists(), params],
  details: () => [...kategoriKeys.all, "detail"],
  detail: (id) => [...kategoriKeys.details(), id],
};

/**
 * Hook to fetch list of kategori with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @param {string} [params.search] - Search term
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useKategoriList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: kategoriKeys.list(params),
    queryFn: async () => {
      const response = await kategoriApi.getAll(params);
      return response.data; // Return full response (data + pagination)
    },
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 0, // Always refetch to ensure fresh data
    ...options,
  });
};

/**
 * Hook to fetch kategori detail
 * @param {string} id - Kategori ID
 * @param {Object} options - React Query options
 * @returns {Object} Query result
 */
export const useKategoriDetail = (id, options = {}) => {
  return useQuery({
    queryKey: kategoriKeys.detail(id),
    queryFn: async () => {
      const response = await kategoriApi.getById(id);
      return response.data.data; // Extract data.data from axios response
    },
    enabled: !!id,
    ...options,
  });
};
