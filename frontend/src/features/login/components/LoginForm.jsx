import z from "zod";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username diperlukan"),
  password: z.string().min(1, "Password diperlukan").min(6, "Password harus minimal 6 karakter"),
});

export const LoginForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/user";

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-session"] });
      navigate(from, { replace: true });
    },
    onError: () => {
      toast.error("Username atau Password Salah", { position: "top-right" });
    },
  });

  const onSubmit = ({ username, password }) => {
    loginMutation.mutate({
      username: username,
      password: password,
    });
  };

  useEffect(() => {
    const firstInput = document.querySelector('input[name="username"]');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);
  return (
    <form
      id="login-form"
      onSubmit={form.handleSubmit(onSubmit)}
      autoComplete="on"
    >
      <FieldGroup>
        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="login-username"
                className="sr-only"
              >
                Username
              </FieldLabel>
              <Input
                {...field}
                id="login-username"
                placeholder="Username"
                autoComplete="username"
                aria-invalid={fieldState.invalid}
                className={`rounded-lg h-12 px-4 text-sm sm:text-base 
                          ${
                            fieldState.invalid
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                          }`}
                disabled={loginMutation.isPending}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="login-password"
                className="sr-only"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  {...field}
                  id="login-password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                  className={`rounded-lg h-12 pr-10 px-4 text-sm sm:text-base
                            ${
                              fieldState.invalid
                                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:border-green-500 focus:ring-green-500"
                            }`}
                  disabled={loginMutation.isPending}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <IconEyeClose /> : <IconEyeOpen />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Forgot Password */}
        {/* <div className="text-right">
          <button
            type="button"
            className="text-sm text-green-600 hover:underline"
            onClick={() => {
              toast.info("Mohon maaf fitur ini belum tersedia dan sedang di kembangkan.");
            }}
          >
            Lupa Password?
          </button>
        </div> */}

        {/* Submit */}
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="login-form"
            disabled={loginMutation.isPending}
            className="h-12 w-full rounded-lg font-semibold 
                      border border-green-600 bg-green-600 text-white 
                      transition hover:bg-green-700 focus:ring-2 focus:ring-green-500
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isPending ? "Memproses..." : "LOGIN"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
};

const IconEyeOpen = () => {
  return (
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
  );
};

const IconEyeClose = () => {
  return (
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
  );
};
