import React, { useState, useEffect } from "react";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { ProfileCard, EditProfileForm, ChangePasswordForm } from "@/components/settings";
import { useProfile } from "@/hooks/api/useSettings";
import { useUpdateProfile, useChangePassword } from "@/hooks/mutations/useSettingsMutations";
import { SettingsSkeleton } from "@/components/loader/SettingsSkeleton";
import { toast } from "react-toastify";

export default function SettingsPage() {
  //  React Query hooks untuk data dan mutations
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  //  Profile form state - akan di-sync dengan data backend
  const [profileFormData, setProfileFormData] = useState({
    fullName: "",
    email: "",
    nim: "",
    nip: "",
  });

  // Password form state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  //  Initialize form data when profile data loads dari backend
  useEffect(() => {
    if (profile) {
      setProfileFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        nim: profile.nim || "",
        nip: profile.nip || "",
      });
    }
  }, [profile]);

  //  Show loading spinner while fetching profile
  if (profileLoading) {
    return <SettingsSkeleton />;
  }

  //  Show error if profile fetch fails
  if (profileError) {
    throw new Error("Gagal memuat data profil. Silahkan coba lagi.");
  }

  // Form handlers
  const handleProfileInputChange = (field, value) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetPasswordForm = () => {
    setPasswordFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  //  Handle profile save dengan backend integration
  const onSaveInfo = async (e) => {
    e.preventDefault();

    //  Build changes object - hanya kirim field yang berubah
    const changes = {};
    if (profileFormData.fullName !== (profile.fullName || "")) {
      changes.fullName = profileFormData.fullName;
    }
    if (profileFormData.email !== (profile.email || "")) {
      changes.email = profileFormData.email;
    }
    if (profileFormData.nim !== (profile.nim || "")) {
      changes.nim = profileFormData.nim;
    }
    if (profileFormData.nip !== (profile.nip || "")) {
      changes.nip = profileFormData.nip;
    }

    if (Object.keys(changes).length === 0) {
      toast.error("Tidak ada perubahan yang terdeteksi!");
      return;
    }

    updateProfileMutation.mutate(changes);
  };

  //  Handle password change dengan backend integration
  const onChangePassword = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      toast.error("Password baru harus minimal 8 karakter!");
      return;
    }

    if (!passwordFormData.currentPassword) {
      toast.error("Password saat ini harus diisi!");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordFormData.currentPassword,
      newPassword: passwordFormData.newPassword,
      confirmPassword: passwordFormData.confirmPassword,
    });

    resetPasswordForm();
  };

  //  Transform backend data untuk komponen UI
  const profileForUI = {
    name: profile?.fullName || profile?.username || "N/A",
    nip: profile?.nip || "N/A",
    nim: profile?.nim || "N/A",
    email: profile?.email || "N/A",
    faculty: profile?.faculty || "N/A",
    facultyAbbreviation: profile?.facultyAbbreviation || "N/A",
    program: profile?.studyProgram || "N/A",
    profilePhoto: null, // TODO: Add profile photo from backend
    role: profile?.role || "N/A",
    username: profile?.username || "N/A",
  };

  return (
    <>
      <HeaderDashboard title="Settings" />

      <div className="space-y-4 sm:space-y-6 scrollbar-gutter-stable">
        {/*  Profile Card dengan data dari backend */}
        <div className="space-y-4">
          <ProfileCard profile={profileForUI} />
        </div>

        <EditProfileForm
          formData={profileFormData}
          onInputChange={handleProfileInputChange}
          onSubmit={onSaveInfo}
          loading={updateProfileMutation.isLoading}
          profile={profile} //  Pass profile untuk conditional fields
        />

        {/*  Change Password Form dengan backend integration */}
        <ChangePasswordForm
          formData={passwordFormData}
          onInputChange={handlePasswordInputChange}
          onSubmit={onChangePassword}
          loading={changePasswordMutation.isLoading}
          lastUpdated={profile?.lastUpdatePassword ? new Date(profile.lastUpdatePassword).toLocaleDateString() : "Belum pernah diubah"}
        />
      </div>
    </>
  );
}
