import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useChangePassword } from "@/features/profile-settings/mutations/useProfileSettingsMutations";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini harus diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const ChangePasswordForm = ({ lastUpdated = "Belum pernah diubah" }) => {
  const changePasswordMutation = useChangePassword();

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold">Ubah Password</h3>
          <div className="text-xs sm:text-sm text-gray-500">Terakhir update password: {lastUpdated}</div>
        </div>

        <form
          id="change-password-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    <div className="sm:col-span-4 flex items-center">
                      <FieldLabel htmlFor="change-password-current">Password Saat Ini</FieldLabel>
                    </div>
                    <div className="sm:col-span-8">
                      <Input
                        {...field}
                        id="change-password-current"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Password Saat Ini"
                        disabled={changePasswordMutation.isLoading}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    <div className="sm:col-span-4 flex items-center">
                      <FieldLabel htmlFor="change-password-new">Password Baru</FieldLabel>
                    </div>
                    <div className="sm:col-span-8">
                      <Input
                        {...field}
                        id="change-password-new"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Password Baru"
                        disabled={changePasswordMutation.isLoading}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    <div className="sm:col-span-4 flex items-center">
                      <FieldLabel htmlFor="change-password-confirm">Konfirmasi Password Baru</FieldLabel>
                    </div>
                    <div className="sm:col-span-8">
                      <Input
                        {...field}
                        id="change-password-confirm"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Konfirmasi Password Baru"
                        disabled={changePasswordMutation.isLoading}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-center sm:justify-end pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={changePasswordMutation.isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="change-password-form"
              className="bg-red-500 hover:bg-red-600"
              disabled={changePasswordMutation.isLoading}
            >
              {changePasswordMutation.isLoading ? "Mengubah..." : "Ubah Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
