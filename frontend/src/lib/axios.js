import axios from "axios";

// Validate environment variables
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

if (!import.meta.env.VITE_BACKEND_URL && import.meta.env.MODE === "production") {
  console.warn("VITE_BACKEND_URL environment variable is not set in production mode");
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

// --- Interceptor untuk Response ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Kondisi utama untuk mencoba refresh token:
    // 1. Status error adalah 401.
    // 2. Request ini BUKAN percobaan ulang.
    // 3. Request yang gagal BUKANLAH request ke endpoint refresh token itu sendiri.
    if (
      error.response?.status === 401 &&
      !originalRequest._isRetry &&
      originalRequest.url !== "/auth/refresh" // <-- KONDISI KUNCI PENCEGAH INFINITE LOOP
    ) {
      originalRequest._isRetry = true;

      try {
        console.log("Access token kedaluwarsa, mencoba refresh...");
        await api.get("/auth/refresh");
        console.log("Token berhasil di-refresh, mengulangi permintaan asli...");
        return api(originalRequest);
      } catch (refreshError) {
        // Blok ini akan berjalan jika endpoint /auth/refresh gagal
        // (misalnya karena refresh token tidak valid atau kedaluwarsa).
        console.error("Refresh token gagal, sesi pengguna berakhir.", refreshError);
        // Lakukan proses logout di sini
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Jika salah satu kondisi di atas tidak terpenuhi,
    // langsung tolak promise-nya. Ini akan menangani:
    // - Semua error selain 401.
    // - Error 401 dari endpoint /auth/refresh (mencegah loop).
    // - Error 401 yang sudah merupakan percobaan ulang.
    return Promise.reject(error);
  }
);
