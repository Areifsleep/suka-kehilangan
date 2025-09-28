// frontend/src/pages/SettingsPage.jsx
import React, { useState, useEffect } from "react";
import { useProfile } from "@/hooks/api/useSettings";
import {
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/mutations/useSettingsMutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FullPageSpinner } from "@/components/FullPageSpinner";
import { toast } from "react-toastify";

export default function SettingsPage() {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    nim: "",
    nip: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        nim: profile.nim || "",
        nip: profile.nip || "",
      });
    }
  }, [profile]);

  if (isLoading) return <FullPageSpinner />;

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-2">❌ Failed to load profile</div>
        <div className="text-sm text-gray-600 mb-4">
          {error.response?.data?.message || error.message}
        </div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Only send changed fields
    const changes = {};
    if (profileForm.fullName !== (profile.fullName || ""))
      changes.fullName = profileForm.fullName;
    if (profileForm.email !== (profile.email || ""))
      changes.email = profileForm.email;
    if (profileForm.nim !== (profile.nim || "")) changes.nim = profileForm.nim;
    if (profileForm.nip !== (profile.nip || "")) changes.nip = profileForm.nip;

    if (Object.keys(changes).length === 0) {
      toast.info("No changes detected");
      return;
    }

    await updateProfile.mutateAsync(changes);
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    await changePassword.mutateAsync(passwordForm);

    // Clear form on success
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </header>

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Read-only fields */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile?.username || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username cannot be changed
                </p>
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile?.role || ""}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Editable fields */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileForm.fullName}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email"
                />
              </div>

              {/* Conditional fields based on role */}
              {profile?.role === "USER" && (
                <div>
                  <Label htmlFor="nim">NIM</Label>
                  <Input
                    id="nim"
                    value={profileForm.nim}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        nim: e.target.value,
                      }))
                    }
                    placeholder="Enter your NIM"
                  />
                </div>
              )}

              {(profile?.role === "PETUGAS" || profile?.role === "ADMIN") && (
                <div>
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={profileForm.nip}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        nip: e.target.value,
                      }))
                    }
                    placeholder="Enter your NIP"
                  />
                </div>
              )}

              {/* Academic info - read only */}
              {profile?.studyProgram && (
                <div>
                  <Label>Study Program</Label>
                  <Input
                    value={`${profile.studyProgram} (${profile.studyProgramLevel})`}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              )}

              {profile?.faculty && (
                <div>
                  <Label>Faculty</Label>
                  <Input
                    value={profile.faculty}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={updateProfile.isLoading}
                className="min-w-[120px]"
              >
                {updateProfile.isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter new password"
                  minLength={8}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  placeholder="Confirm new password"
                  required
                />
                {passwordForm.confirmPassword &&
                  passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={changePassword.isLoading}
                variant="destructive"
                className="min-w-[120px]"
              >
                {changePassword.isLoading ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-500">Account Created</Label>
              <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-gray-500">Last Updated</Label>
              <p>{new Date(profile?.updatedAt).toLocaleDateString()}</p>
            </div>
            {profile?.lastUpdatePassword && (
              <div>
                <Label className="text-gray-500">Last Password Change</Label>
                <p>
                  {new Date(profile.lastUpdatePassword).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
