import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// frontend/src/components/settings/EditProfileForm.jsx
export const EditProfileForm = ({
  formData,
  onInputChange,
  onSubmit,
  loading = false,
  profile,
}) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Edit Informasi
        </h3>
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Nama</Label>
            </div>
            <div className="sm:col-span-8">
              <Input
                placeholder="Nama"
                value={formData.fullName}
                onChange={(e) => onInputChange("fullName", e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Email</Label>
            </div>
            <div className="sm:col-span-8">
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
