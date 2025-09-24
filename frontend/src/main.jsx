import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./styles/global.css";
import LoginPage from "./pages/LoginPage.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Grup rute yang menggunakan MainLayout (dengan Navbar) */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<App />}
            />
            {/* Tambahkan rute lain yang butuh navbar di sini */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
          </Route>

          {/* Grup rute yang menggunakan AuthLayout (tanpa Navbar) */}
          <Route path="auth">
            <Route
              path="login"
              element={<LoginPage />}
            />
            {/* <Route path="register" element={<Register />} /> */}
          </Route>

          {/* Anda juga bisa menambahkan rute untuk halaman 404 Not Found di sini */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>
);

// Contoh saja
function Login() {
  return <div>login page</div>;
}

// Ini CUman contoh baiknya dipisah file
function MainLayout() {
  return (
    <div className="auth-container">
      {/* header */}
      {/* Konten halaman  akan dirender di sini */}
      <Outlet />
      {/* footer */}
    </div>
  );
}
