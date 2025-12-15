import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

// Query Keys
const QUERY_KEYS = {
  users: "management-users",
  regularUsers: "management-regular-users",
  user: (id) => ["management-user", id],
  roles: "management-roles",
  studyPrograms: "management-study-programs",
  petugas: "management-petugas",
  mahasiswa: "management-mahasiswa",
  dashboardStats: "management-dashboard-stats",
  dashboardActivities: "management-dashboard-activities",
};

// API Functions
const managementApi = {
  getUsers: async (params) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.roleId) searchParams.append("roleId", params.roleId);
    if (params.lokasiPos) searchParams.append("lokasiPos", params.lokasiPos);

    const response = await api.get(
      `/management/users?${searchParams.toString()}`
    );
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/management/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post("/management/users", userData);
    return response.data;
  },

  updateUser: async ({ id, ...userData }) => {
    const response = await api.put(`/management/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/management/users/${id}`);
    return response.data;
  },

  resetPassword: async ({ id, newPassword }) => {
    const response = await api.put(`/management/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  getRoles: async () => {
    const response = await api.get("/management/roles");
    return response.data;
  },

  getStudyPrograms: async () => {
    const response = await api.get("/management/study-programs");
    return response.data;
  },

  getRegularUsers: async (params) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);

    const response = await api.get(
      `/management/regular-users?${searchParams.toString()}`
    );
    return response.data;
  },

  getPetugas: async (params) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);
    if (params.lokasiPos) searchParams.append("lokasiPos", params.lokasiPos);

    const response = await api.get(
      `/management/petugas?${searchParams.toString()}`
    );
    return response.data;
  },

  getMahasiswa: async (params) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.search) searchParams.append("search", params.search);

    const response = await api.get(
      `/management/mahasiswa?${searchParams.toString()}`
    );
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/dashboard/admin");
    return response.data;
  },

  getDashboardActivities: async () => {
    // Backend returns activities in the same endpoint
    const response = await api.get("/dashboard/admin");
    return response.data;
  },
};

// Query Hooks
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.users, params],
    queryFn: () => managementApi.getUsers(params),
    keepPreviousData: true,
  });
};

export const useRegularUsers = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.regularUsers, params],
    queryFn: () => managementApi.getRegularUsers(params),
    keepPreviousData: true,
  });
};

export const useUser = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => managementApi.getUserById(id),
    enabled: !!id,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.roles],
    queryFn: managementApi.getRoles,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStudyPrograms = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.studyPrograms],
    queryFn: managementApi.getStudyPrograms,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePetugas = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.petugas, params],
    queryFn: () => managementApi.getPetugas(params),
    keepPreviousData: true,
  });
};

export const useMahasiswa = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.mahasiswa, params],
    queryFn: () => managementApi.getMahasiswa(params),
    keepPreviousData: true,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboardStats],
    queryFn: managementApi.getDashboardStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useDashboardActivities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboardActivities],
    queryFn: managementApi.getDashboardActivities,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Mutation Hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: managementApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.regularUsers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.petugas] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mahasiswa] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: managementApi.updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.regularUsers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.petugas] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mahasiswa] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.user(variables.id),
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: managementApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.regularUsers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.petugas] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.mahasiswa] });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: managementApi.resetPassword,
  });
};
