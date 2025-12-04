import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { reportApi } from "../api/reportApi";

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.createReport,
    onSuccess: (response) => {
      // Invalidate and refetch user reports
      queryClient.invalidateQueries({
        queryKey: ["reports", "user"],
      });

      // Show success message
      toast.success("Laporan kehilangan berhasil dikirim! Tim kami akan segera memproses laporan Anda.");
    },
    onError: (error) => {
      console.error("Error creating report:", error);

      // Handle different error scenarios
      if (error.response?.status === 413) {
        toast.error("File gambar terlalu besar. Maksimal ukuran file 5MB per gambar.");
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message || "Data yang dikirim tidak valid. Mohon periksa kembali formulir.";
        toast.error(message);
      } else if (error.response?.status === 401) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
      } else {
        const message = error.response?.data?.message || "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.";
        toast.error(message);
      }
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => reportApi.updateReport(id, data),
    onSuccess: (response) => {
      // Invalidate and refetch user reports
      queryClient.invalidateQueries({
        queryKey: ["reports", "user"],
      });

      // Show success message
      toast.success("Laporan berhasil diperbarui!");
    },
    onError: (error) => {
      console.error("Error updating report:", error);

      const message = error.response?.data?.message || "Gagal memperbarui laporan. Silakan coba lagi.";
      toast.error(message);
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.deleteReport,
    onSuccess: (response) => {
      // Invalidate and refetch user reports
      queryClient.invalidateQueries({
        queryKey: ["reports", "user"],
      });

      // Show success message
      toast.success("Laporan berhasil dihapus!");
    },
    onError: (error) => {
      console.error("Error deleting report:", error);

      const message = error.response?.data?.message || "Gagal menghapus laporan. Silakan coba lagi.";
      toast.error(message);
    },
  });
};
