import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { api } from "@/lib/axios";

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["settings", "profile", user?.id],
    queryFn: async () => {
      const response = await api.get("/settings/profile");
      return response.data.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
