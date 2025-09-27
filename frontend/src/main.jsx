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
import ManagementUser from "./pages/ManagementUser.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";
import ManagementPetugas from "./pages/ManagementPetugas.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminLayout } from "./layouts/AdminLayout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";

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
          { path: "/beranda", element: <App /> },
          { path: "/petugas", element: <App /> },
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
