import { useQuery } from "@tanstack/react-query";
import { reportApi } from "../api/reportApi";

export const useReportCategories = () => {
  return useQuery({
    queryKey: ["report-categories"],
    queryFn: reportApi.getCategories,
    select: (data) => data.data.data,
    staleTime: 1000 * 60 * 30, // 30 minutes - categories don't change often
    cacheTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    onError: (error) => {
      console.error("Error fetching report categories:", error);
    },
  });
};

export const useUserReports = (params = {}) => {
  return useQuery({
    queryKey: ["reports", "user", params],
    queryFn: () => reportApi.getUserReports(params),
    select: (data) => data.data.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching user reports:", error);
    },
  });
};

export const useReportById = (id) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportApi.getReportById(id),
    select: (data) => data.data.data,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching report:", error);
    },
  });
};
