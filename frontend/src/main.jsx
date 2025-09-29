import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import "./styles/global.css";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import ManagementUser from "./pages/ManagementUser.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";
import ManagementPetugas from "./pages/ManagementPetugas.jsx";
import PetugasDashboard from "./pages/PetugasDashboard.jsx";
import PetugasUploadPage from "./pages/PetugasUploadPage.jsx";
import PetugasManageReportsPage from "./pages/PetugasManageReportsPage.jsx";
import PetugasVerifyReportsPage from "./pages/PetugasVerifyReportsPage.jsx";
import PetugasReportsPage from "./pages/PetugasReportsPage.jsx";
import UserLostItemsList from "./pages/UserLostItemsList.jsx";
import UserLostItemDetail from "./pages/UserLostItemDetail.jsx";
import UserReportLostItem from "./pages/UserReportLostItem.jsx";
import UserMyReports from "./pages/UserMyReports.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";
import { UserLayout } from "./layouts/UserLayout.jsx";
import { PetugasLayout } from "./layouts/PetugasLayout.jsx";
import { RoleBasedLayout } from "./layouts/RoleBasedLayout.jsx";

import SettingPage from "./pages/SettingPage.jsx";

function MainLayout() {
  return (
    <ProtectedRoute>
      {/* Navbar, Header, dll. */}
      <main>
        <Outlet />
      </main>
      {/* Footer, dll. */}
    </ProtectedRoute>
  );
}

function RootLayout() {
  return (
    <>
      <AuthProvider>
        <ToastContainer />
        <Outlet />
      </AuthProvider>
    </>
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
                element: <UserLostItemsList />,
              },
              {
                path: "item/:id",
                element: <UserLostItemDetail />,
              },
              {
                path: "report",
                element: <UserReportLostItem />,
              },
              {
                path: "my-reports",
                element: <UserMyReports />,
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
              {
                path: "verify-reports",
                element: <PetugasVerifyReportsPage />,
              },
              {
                path: "reports",
                element: <PetugasReportsPage />,
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
            ],
          },
          {
            path: "/settings",
            // element: <SettingsPage />,
            element: <RoleBasedLayout />,
            children: [
              {
                index: true,
                element: <SettingPage />,
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
