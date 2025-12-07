import { api } from "@/lib/axios";
import { queryOptions } from "@tanstack/react-query";

export const getSessionQueryOptions = queryOptions({
  queryKey: ["auth-session"],
  queryFn: async () => {
    const response = await api.get("/auth/session");
    return response.data.data;
  },
  throwOnError: (error) => {
    // Apakah error ini harus dilempar?
    // Jika error 401, JANGAN lempar
    if (error.response?.status === 401) {
      return false;
    }
    // Untuk semua error lainnya (500, network error), LEMPAR
    return true;
  },

  retry: false,
  refetchOnWindowFocus: true,
});
