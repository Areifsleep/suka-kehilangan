import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petugasBarangTemuanApi } from "../api/barangTemuanApi";
import { petugasBarangTemuanKeys } from "../queries/useBarangTemuan";
import { toast } from "sonner";

/**
 * Mutation to create new barang temuan
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useCreateBarangTemuan = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, files }) => petugasBarangTemuanApi.create(data, files),
    onSuccess: (response) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.stats(),
      });

      toast.success(response.data.message || "Barang berhasil ditambahkan");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal menambahkan barang";
      toast.error(message);
    },
    ...options,
  });
};

/**
 * Mutation to update barang temuan
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useUpdateBarangTemuan = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, files }) =>
      petugasBarangTemuanApi.update(id, data, files),
    onSuccess: (response, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.stats(),
      });

      toast.success(response.data.message || "Barang berhasil diupdate");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Gagal mengupdate barang";
      toast.error(message);
    },
    ...options,
  });
};

/**
 * Mutation to mark barang as SUDAH_DIAMBIL
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useMarkBarangDiambil = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data, files }) =>
      petugasBarangTemuanApi.markDiambil(id, data, files),
    onSuccess: (response, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.stats(),
      });

      toast.success(
        response.data.message ||
          "Barang berhasil ditandai sebagai sudah diambil"
      );
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        "Gagal menandai barang sebagai diambil";
      toast.error(message);
    },
    ...options,
  });
};

/**
 * Mutation to delete barang temuan
 * @param {Object} options - Mutation options
 * @returns {Object} Mutation result
 */
export const useDeleteBarangTemuan = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => petugasBarangTemuanApi.delete(id),
    onSuccess: (response) => {
      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: petugasBarangTemuanKeys.stats(),
      });

      toast.success(response.data.message || "Barang berhasil dihapus");
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Gagal menghapus barang";
      toast.error(message);
    },
    ...options,
  });
};
