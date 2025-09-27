import { create } from "zustand";
import { persist } from "zustand/middleware";
export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: () => set({ isAuthenticated: true }),
      setUnauthenticated: () => set({ isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
