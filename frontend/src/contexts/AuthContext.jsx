import { useNavigate } from "react-router";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { FullPageSpinner } from "@/components/common/FullPageSpinner";
import { useAuthStore } from "@/stores/authStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuthenticated, setUnauthenticated } = useAuthStore.getState();

  const {
    data: user,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const response = await api.get("/auth/session");
      return response.data.data;
    },

    // Logika pemilahan error dipindahkan ke sini
    throwOnError: (error) => {
      // Apakah error ini harus dilempar?
      // Jika error 401, JANGAN lempar (return false)
      if (error.response?.status === 401) {
        return false;
      }
      // Untuk semua error lainnya (500, network error), LEMPAR (return true)
      return true;
    },

    retry: false,
    refetchOnWindowFocus: false,
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.clear();
      setUnauthenticated();
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Error logout:", error);
      queryClient.clear();
      setUnauthenticated();
      navigate("/", { replace: true });
    },
  });

  // Gunakan useMemo untuk mencegah re-render yang tidak perlu pada komponen consumer
  // Nilai context hanya akan dibuat ulang jika 'user', 'isLoading', atau 'error' berubah.
  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      logout: logout.mutate,
      isLoggingOut: logout.isPending,
      isAuthenticated: !isLoading && !!user && !error,
    }),
    [user, isLoading, error, logout.mutate, logout.isPending]
  );

  // Jika ada error yang bukan 401 (misalnya network error), tampilkan error page
  if (error && error.response?.status !== 401) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="text-6xl font-bold text-red-500 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Kesalahan Koneksi</h1>
            <p className="text-gray-600 mb-4">Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Melakukan sync hasil React Query ke Zustand
  useEffect(() => {
    if (isSuccess && user) {
      setAuthenticated();
    }
  }, [isSuccess, user, setAuthenticated, setUnauthenticated]);

  // Selalu render children. Biarkan komponen lain yang memutuskan
  // untuk menampilkan loading spinner berdasarkan 'isLoading' dari context.
  // Ini menghindari layar putih/flicker.
  return <AuthContext.Provider value={value}>{isLoading ? <FullPageSpinner /> : children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth harus digunakan dalam AuthProvider");
  }
  return context;
};
