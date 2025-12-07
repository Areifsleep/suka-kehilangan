import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import "./styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminDashboard from "./features/admin-management/pages/AdminDashboard.jsx";

import ManagementUser from "./features/admin-management/pages/ManagementUser.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";
import ManagementPetugas from "./features/admin-management/pages/ManagementPetugas.jsx";
import PetugasDashboard from "./features/petugas/pages/PetugasDashboard.jsx";
import PetugasUploadPage from "./features/petugas/pages/PetugasUploadPage.jsx";
import PetugasManageReportsPage from "./features/petugas/pages/PetugasManageReportsPage.jsx";
import AuditReportsPage from "./features/admin-management/pages/AuditReportsPage.jsx";
import { AuthProvider } from "./features/auth/contexts/AuthContext.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ProtectedRoute } from "./features/auth/guard/ProtectedRoute";
import { RedirectIfLoggedIn } from "./features/auth/guard/RedirectIfLoggedIn";
import { UserLayout } from "./layouts/UserLayout.jsx";
import { PetugasLayout } from "./layouts/PetugasLayout.jsx";
import { RoleBasedLayout } from "./layouts/RoleBasedLayout.jsx";

import ProfileSettingsPage from "./features/profile-settings/pages/ProfileSettingsPage.jsx";

import BerandaUserPage from "./features/user/pages/BerandaUser.jsx";
import Detaillaporan from "./features/user/pages/DetailLaporan.jsx";

function MainLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Outlet />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <GlobalErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/user",
            element: <UserLayout />,

            children: [
              {
                index: true,
                element: <BerandaUserPage />,
              },
              {
                path: "item/:id",
                element: <Detaillaporan />,
              },
            ],
          },
          {
            path: "/petugas",
            element: <PetugasLayout />,
            children: [
              {
                index: true,
                element: <PetugasDashboard />,
              },
              {
                path: "upload",
                element: <PetugasUploadPage />,
              },
              {
                path: "manage-reports",
                element: <PetugasManageReportsPage />,
              },
            ],
          },
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "manage-users",
                element: <ManagementUser />,
              },
              {
                path: "manage-officers",
                element: <ManagementPetugas />,
              },
              {
                path: "audit-reports",
                element: <AuditReportsPage />,
              },
            ],
          },
          {
            path: "/settings",
            element: <RoleBasedLayout />,
            children: [
              {
                index: true,
                element: <ProfileSettingsPage />,
              },
            ],
          },
        ],
      },
      {
        children: [
          {
            path: "/",
            element: <RedirectIfLoggedIn />,
            children: [{ index: true, element: <LoginPage /> }],
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
