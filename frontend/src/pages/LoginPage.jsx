import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { useFormValidation, validationRules } from "@/hooks/useFormValidation";
import UIN from "@/assets/UIN.png";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const usernameRef = useRef(null);

  // Auto-focus username field when component mounts
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Form validation setup
  const { errors, validate, clearError } = useFormValidation({
    username: [validationRules.required("Username is required")],
    password: [validationRules.required("Password is required"), validationRules.minLength(6, "Password must be at least 6 characters")],
  });

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || "/beranda";

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch user session
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      // Navigate to intended destination or default dashboard
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const message = "Username atau Password Salah";
      toast.error(message, { position: "top-right" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const formData = { username: username.trim(), password };
    if (!validate(formData)) {
      return;
    }

    // Submit login
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[420px] sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="flex flex-col items-center mb-6">
          <img
            src={UIN}
            alt="UIN Sunan Kalijaga Logo"
            className="mb-4 object-contain"
            style={{ width: "250px", height: "250px", maxWidth: "250px", maxHeight: "250px" }}
          />

          <h1
            className="text-2xl sm:text-3xl md:text-3xl font-serif text-yellow-600 tracking-wide font-bold"
            style={{
              fontFamily: "'Cinzel', serif",
            }}
          >
            SUKA KEHILANGAN
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center max-w-xs">
            Merasa Kehilangan Hubungi Suka Kehilangan
            <br /> Temukan Barang Anda Di Sini
          </p>
        </div>

        <Card className="bg-transparent shadow-none border-0">
          <CardContent className="bg-transparent p-0">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="h-12">
                <Label className="sr-only">Username</Label>
                <Input
                  ref={usernameRef}
                  placeholder="Username"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      clearError("username");
                    }
                    if (submitError) {
                      setSubmitError("");
                    }
                  }}
                  className={`rounded-lg shadow-sm px-4 py-3 text-sm sm:text-base h-full ${
                    errors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  disabled={loginMutation.isPending}
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
              </div>

              <div className="relative h-12">
                <Label className="sr-only">Password</Label>
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      clearError("password");
                    }
                    if (submitError) {
                      setSubmitError("");
                    }
                  }}
                  className={`rounded-lg shadow-sm pr-10 px-4 py-3 text-sm sm:text-base h-full ${
                    errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  disabled={loginMutation.isPending}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.584 10.587a2 2 0 0 0 2.828 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.363 5.365A9.466 9.466 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.172 2.435"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6.584 6.584C4.284 8.15 2.454 10.696 2 12c0 0 3 7 10 7a9.716 9.716 0 0 0 5.417-1.584"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              <div className="text-right -mt-2">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Lupa Password?
                </a>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="h-12 cursor-pointer w-full rounded-lg py-3 font-semibold border-2 border-gray-300 bg-white text-gray-700 transition-all duration-150 ease-in-out hover:bg-green-500 hover:border-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} UIN Sunan Kalijaga. All rights reserved</div>
      </div>
    </div>
  );
}
