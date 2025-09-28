// frontend/src/hooks/api/useSettings.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/axios";

export const useProfile = () => {
  const { user } = useAuth(); // Get current user for cache key

  return useQuery({
    queryKey: ["settings", "profile", user?.id], // ✅ Include user ID in cache key
    queryFn: async () => {
      const response = await api.get("/settings/profile");
      return response.data.data;
    },
    enabled: !!user?.id, // ✅ Only fetch when user is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
