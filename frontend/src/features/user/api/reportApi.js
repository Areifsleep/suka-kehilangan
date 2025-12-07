import { api } from "@/lib/axios";

// Report API endpoints
export const reportApi = {
  // Get report categories
  getCategories: () => api.get("/categories"),

  // Create new report
  createReport: (reportData) => {
    const formData = new FormData();

    // Append regular fields
    Object.keys(reportData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, reportData[key]);
      }
    });

    // Append images
    if (reportData.images && reportData.images.length > 0) {
      reportData.images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });
    }

    return api.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get user's reports
  getUserReports: (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    });
    return api.get(`/reports/my-reports?${queryParams}`);
  },

  // Get report by ID
  getReportById: (id) => api.get(`/reports/${id}`),

  // Update report
  updateReport: (id, reportData) => {
    const formData = new FormData();

    // Append regular fields
    Object.keys(reportData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, reportData[key]);
      }
    });

    // Append images
    if (reportData.images && reportData.images.length > 0) {
      reportData.images.forEach((image, index) => {
        formData.append(`images`, image.file);
      });
    }

    return api.put(`/reports/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete report
  deleteReport: (id) => api.delete(`/reports/${id}`),
};
