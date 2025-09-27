import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.jsx";
import { ToastContainer } from "react-toastify";

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
          { path: "/admin", element: <App /> },
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
