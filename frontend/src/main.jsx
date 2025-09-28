import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

import App from "./App.jsx";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import ManagementUser from "./pages/ManagementUser.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";
import ManagementPetugas from "./pages/ManagementPetugas.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";
import { UserLayout } from "./layouts/UserLayout.jsx";
import { PetugasLayout } from "./layouts/PetugasLayout.jsx";
import { RoleBasedLayout } from "./layouts/RoleBasedLayout.jsx";
import { AlertProvider } from "./components/AlertProvider.jsx";

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
        <AlertProvider>
          <ToastContainer />
          <Outlet />
        </AlertProvider>
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
          { path: "/user", element: <UserLayout />, children: [{ index: true, element: <div>Halaman User</div> }] },
          {
            path: "/petugas",
            element: <PetugasLayout />,
            children: [
              {
                index: true,
                element: <div>Halaman Petugas</div>,
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
            element: <RoleBasedLayout />,
            children: [
              {
                index: true,
                element: <AdminSettings />,
              },
              {
                path: "profile",
                element: <div>Profile Settings Page</div>,
              },
              {
                path: "account",
                element: <div>Account Settings Page</div>,
              },
              {
                path: "notifications",
                element: <div>Notification Settings Page</div>,
              },
              {
                path: "privacy",
                element: <div>Privacy Settings Page</div>,
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
