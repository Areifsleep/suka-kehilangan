import { Navigate, useLocation, Outlet } from "react-router";

import { useAuth } from "@/contexts/AuthContext";

export const ROLE_DASHBOARD_PATH = {
  USER: "/user",
  ADMIN: "/admin",
  PETUGAS: "/petugas",
};

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Jika tidak ada user (belum login), alihkan ke halaman utama/login.
  //    Simpan lokasi asal agar setelah login bisa kembali ke halaman yang dituju.
  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  //  Cek apakah role user ada dalam mapping dasbor.
  const designatedPath = ROLE_DASHBOARD_PATH[user.role];

  // Exception: Path yang diawali dengan "/settings" dapat diakses oleh semua role
  if (location.pathname.startsWith("/settings")) {
    return <Outlet />;
  }

  // Cek apakah path saat ini DIAWALI DENGAN path dasbor yang seharusnya.
  if (!designatedPath || location.pathname.startsWith(designatedPath)) {
    return <Outlet />;
  }

  // 3. Jika user sudah login TAPI mencoba mengakses rute lain
  //    (misalnya admin mencoba akses /beranda), alihkan ke dasbornya.
  return (
    <Navigate
      to={designatedPath}
      replace
    />
  );
};
