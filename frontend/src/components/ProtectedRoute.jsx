import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export const ROLE_DASHBOARD_PATH = {
  USER: "/beranda",
  ADMIN: "/admin",
  PETUGAS: "/petugas",
};

export const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  // 1. Jika tidak ada user (belum login), alihkan ke halaman utama/login.
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

  // 2. Cek apakah role user ada dalam mapping dasbor.
  const designatedPath = ROLE_DASHBOARD_PATH[user.role];

  // Jika user tidak memiliki role yang dikenali ATAU
  // jika user sudah berada di halaman dasbor yang benar untuk rolenya,
  // maka tampilkan halaman yang dituju (children).
  // Di sini kita menggunakan <Outlet /> yang merupakan praktik standar
  // untuk nested routing di React Router v6.
  if (!designatedPath || location.pathname === designatedPath) {
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
