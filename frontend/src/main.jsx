import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import GlobalErrorPage from "./pages/GlobalErrorPage.jsx";

// Layout component Anda (tidak perlu diubah)
function MainLayout() {
  return (
    <div>
      {/* Navbar, Header, dll. */}
      <main>
        <Outlet />
      </main>
      {/* Footer, dll. */}
    </div>
  );
}

// Definisikan router menggunakan createBrowserRouter
const router = createBrowserRouter([
  {
    // Rute dengan MainLayout
    element: <MainLayout />,
    errorElement: <GlobalErrorPage />, // <-- Tangani semua error di sini!
    children: [
      {
        path: "/",
        element: <App />,
      },
      // { path: "/profile", element: <Profile /> }
    ],
  },
  {
    // Rute untuk otentikasi (tanpa layout utama)
    path: "auth",
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
  {
    // Rute Not Found
    path: "*",
    element: <NotFoundPage />,
  },
]);

const queryClient = new QueryClient();

// Render aplikasi menggunakan <RouterProvider>
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);
