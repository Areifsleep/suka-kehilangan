import { FullPageSpinner } from "@/components/FullPageSpinner";
import { api } from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      // queryFn sekarang bisa lebih "bodoh", tidak perlu try/catch
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
  });

  // Logout mutation
  const logout = useMutation({
    mutationFn: () => api.post("/auth/logout"),
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even if logout fails, clear local session
      queryClient.setQueryData(["auth-session"], null);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h1>
            <p className="text-gray-600 mb-4">Unable to connect to the server. Please check your internet connection.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  // Selalu render children. Biarkan komponen lain yang memutuskan
  // untuk menampilkan loading spinner berdasarkan 'isLoading' dari context.
  // Ini menghindari layar putih/flicker.
  return <AuthContext.Provider value={value}>{isLoading ? <FullPageSpinner /> : children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
