import axios from "axios";

import { useAuthStore } from "@/stores/authStore";

// Validate environment variables
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

if (!import.meta.env.VITE_BACKEND_URL && import.meta.env.MODE === "production") {
  console.warn("VITE_BACKEND_URL environment variable is not set in production mode");
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cek jika errornya BUKAN 401, langsung reject saja.
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Jika error 401 terjadi pada request refresh itu sendiri, reject.
    if (originalRequest.url === "/auth/refresh") {
      console.error("Token refresh tidak valid, proses logout...");
      useAuthStore.getState().setUnauthenticated(); // <-- Update state
      // Lakukan redirect atau tindakan logout lain di sini
      return Promise.reject(error);
    }

    // --- KONDISI KUNCI YANG BARU ---
    // Cek status autentikasi dari store kita.
    const isAuthenticated = useAuthStore.getState().isAuthenticated;

    // Jika ini adalah percobaan ulang (retry), jangan coba lagi.
    if (originalRequest._isRetry) {
      console.error("Percobaan ulang permintaan setelah token refresh juga gagal.");
      useAuthStore.getState().setUnauthenticated(); // <-- Update state
      return Promise.reject(error);
    }

    // Jika user BELUM PERNAH TERAUTENTIKASI sebelumnya, jangan coba refresh.
    // Ini menangani kasus pengguna baru yang membuka page.
    if (!isAuthenticated) {
      console.log("Pengguna belum terautentikasi, lewati token refresh.");
      return Promise.reject(error);
    }

    // --- Proses Refresh Token ---
    // Jika lolos dari semua kondisi di atas, berarti ini adalah user yang
    // sesinya kedaluwarsa dan perlu di-refresh.
    originalRequest._isRetry = true;
    try {
      console.log("Sesi kedaluwarsa, mencoba token refresh...");
      await api.get("/auth/refresh");
      console.log("Token refresh berhasil, mengulang permintaan asli.");
      return api(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh gagal.", refreshError);
      useAuthStore.getState().setUnauthenticated(); // <-- Update state
      return Promise.reject(refreshError);
    }
  }
);
