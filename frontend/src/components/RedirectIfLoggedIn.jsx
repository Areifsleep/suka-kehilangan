import { Navigate, Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";

import { ROLE_DASHBOARD_PATH } from "./ProtectedRoute";

const RedirectIfLoggedIn = () => {
  const { user } = useAuth();

  // Jika user sudah login, arahkan ke dashboard sesuai perannya
  if (user) {
    const destination = ROLE_DASHBOARD_PATH[user.role];
    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  // Jika tidak ada user (belum login), tampilkan halaman yang seharusnya (LoginPage)
  return <Outlet />;
};

export default RedirectIfLoggedIn;
