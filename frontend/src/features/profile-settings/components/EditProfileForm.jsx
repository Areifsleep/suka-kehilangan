import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useUpdateProfile } from "@/features/profile-settings/mutations/useProfileSettingsMutations";
import { toast } from "react-toastify";

const editProfileSchema = z.object({
  fullName: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid"),
});

export const EditProfileForm = ({ profile }) => {
  const updateProfileMutation = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: profile?.fullName || "",
      email: profile?.email || "",
    },
  });

  const onSubmit = (data) => {
    const changes = {};
    if (data.fullName !== (profile.fullName || "")) {
      changes.fullName = data.fullName;
    }
    if (data.email !== (profile.email || "")) {
      changes.email = data.email;
    }

    if (Object.keys(changes).length === 0) {
      toast.error("Tidak ada perubahan yang terdeteksi!");
      return;
    }

    updateProfileMutation.mutate(changes);
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">Edit Informasi</h3>
        <form
          id="edit-profile-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    <div className="sm:col-span-4 flex items-center">
                      <FieldLabel htmlFor="edit-profile-fullName">Nama</FieldLabel>
                    </div>
                    <div className="sm:col-span-8">
                      <Input
                        {...field}
                        id="edit-profile-fullName"
                        aria-invalid={fieldState.invalid}
                        placeholder="Nama"
                        disabled={updateProfileMutation.isLoading}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </div>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
                    <div className="sm:col-span-4 flex items-center">
                      <FieldLabel htmlFor="edit-profile-email">Email</FieldLabel>
                    </div>
                    <div className="sm:col-span-8">
                      <Input
                        {...field}
                        id="edit-profile-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="Email"
                        disabled={updateProfileMutation.isLoading}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={updateProfileMutation.isLoading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="edit-profile-form"
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
