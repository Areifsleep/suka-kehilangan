import { api } from "@/lib/axios";

export const auditReportsApi = {
  // Get audit reports with filters
  getAuditReports: async (params) => {
    const response = await api.get("/management/audit-reports", { params });
    return response.data;
  },

  // Get audit statistics
  getAuditStats: async () => {
    const response = await api.get("/management/audit-stats");
    return response.data;
  },

  // Get categories for filter
  getCategories: async () => {
    const response = await api.get("/management/categories");
    return response.data;
  },

  // Export audit reports to PDF
  exportAuditReports: async (params) => {
    const response = await api.get("/management/audit-reports/export", {
      params,
      responseType: "blob",
    });
    return response;
  },
};
