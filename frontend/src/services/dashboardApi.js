import { api } from "@/lib/axios";

export const dashboardApi = {
  // Get dashboard stats for petugas
  getPetugasDashboard: async () => {
    const response = await api.get("/dashboard/petugas");
    return response.data;
  },

  // Get dashboard stats for admin
  getAdminDashboard: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },

  // Get dashboard stats for user
  getUserDashboard: async () => {
    const response = await api.get("/dashboard/user");
    return response.data;
  },
};
