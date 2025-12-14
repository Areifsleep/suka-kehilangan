import { useMutation, useQueryClient } from "@tanstack/react-query";
import { kategoriApi } from "../api/kategoriApi";
import { kategoriKeys } from "../queries/useKategori";
import { toast } from "react-toastify";

/**
 * Mutation to create new kategori
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useCreateKategori = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => kategoriApi.create(data),
    onSuccess: (response) => {
      // Invalidate kategori list queries
      queryClient.invalidateQueries({
        queryKey: kategoriKeys.lists(),
      });

      toast.success(response.data.message || "Kategori berhasil ditambahkan");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal menambahkan kategori";
      toast.error(message);
    },
    ...options,
  });
};

/**
 * Mutation to update kategori
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useUpdateKategori = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => kategoriApi.update(id, data),
    onSuccess: (response, variables) => {
      // Invalidate kategori list and detail queries
      queryClient.invalidateQueries({
        queryKey: kategoriKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: kategoriKeys.detail(variables.id),
      });

      toast.success(response.data.message || "Kategori berhasil diupdate");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate kategori";
      toast.error(message);
    },
    ...options,
  });
};

/**
 * Mutation to delete kategori
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useDeleteKategori = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => kategoriApi.delete(id),
    onSuccess: (response) => {
      // Invalidate kategori list queries
      queryClient.invalidateQueries({
        queryKey: kategoriKeys.lists(),
      });

      toast.success(response.data.message || "Kategori berhasil dihapus");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal menghapus kategori";
      toast.error(message);
    },
    ...options,
  });
};
