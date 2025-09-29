import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const ChangePasswordForm = ({ formData, onInputChange, onSubmit, loading = false, lastUpdated = "26 September 2025" }) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold">Ubah Password</h3>
          <div className="text-xs sm:text-sm text-gray-500">Terakhir update password: {lastUpdated}</div>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 sm:space-y-6"
        >
          {/* Current Password */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Password Saat Ini</Label>
            </div>
            <div className="sm:col-span-8">
              <Input
                placeholder="Password Saat Ini"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => onInputChange("currentPassword", e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Password Baru</Label>
            </div>
            <div className="sm:col-span-8">
              <Input
                placeholder="Password Baru"
                type="password"
                value={formData.newPassword}
                onChange={(e) => onInputChange("newPassword", e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4">
            <div className="sm:col-span-4 flex items-center">
              <Label className="text-sm sm:text-base font-medium">Konfirmasi Password Baru</Label>
            </div>
            <div className="sm:col-span-8">
              <Input
                placeholder="Konfirmasi Password Baru"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => onInputChange("confirmPassword", e.target.value)}
                className="w-full"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-4">
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 w-full sm:w-auto min-w-[140px]"
              disabled={loading}
            >
              {loading ? "Mengubah..." : "Ubah Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
