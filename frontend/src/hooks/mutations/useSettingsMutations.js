// frontend/src/hooks/mutations/useSettingsMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/axios";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (profileData) => api.put("/settings/profile", profileData),
    onSuccess: (response) => {
      // Update specific user cache
      queryClient.setQueryData(
        ["settings", "profile", user?.id],
        response.data.data
      );

      // Invalidate related caches for current user
      queryClient.invalidateQueries({
        queryKey: ["auth-session"],
      });

      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (passwordData) =>
      api.put("/settings/change-password", passwordData),
    onSuccess: () => {
      // Optionally invalidate user session after password change
      queryClient.invalidateQueries({
        queryKey: ["auth-session"],
      });

      toast.success("Password changed successfully");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to change password";
      toast.error(message);
    },
  });
};
