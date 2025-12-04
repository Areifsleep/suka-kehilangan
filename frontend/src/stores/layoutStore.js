import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLayoutStore = create(
  persist(
    (set) => ({
      collapsed: false,
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    {
      name: "layout-storage",
    }
  )
);
