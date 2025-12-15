import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/dashboardApi";

const QUERY_KEYS = {
  petugasDashboard: ["petugas", "dashboard"],
  adminDashboard: ["admin", "dashboard"],
  userDashboard: ["user", "dashboard"],
};

export const usePetugasDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.petugasDashboard,
    queryFn: dashboardApi.getPetugasDashboard,
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Data is fresh for 30 seconds
  });
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.adminDashboard,
    queryFn: dashboardApi.getAdminDashboard,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const useUserDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.userDashboard,
    queryFn: dashboardApi.getUserDashboard,
    refetchInterval: 60000,
    staleTime: 30000,
  });
};
