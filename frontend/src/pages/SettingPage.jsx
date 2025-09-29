import React, { useState, useEffect } from "react";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import {
  ProfileCard,
  EditProfileForm,
  ChangePasswordForm,
} from "@/components/settings";
import { useAlert } from "@/components/AlertProvider";
import { useProfile } from "@/hooks/api/useSettings";
import {
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/mutations/useSettingsMutations";
import { SettingsSkeleton } from "@/components/loader/SettingsSkeleton";

export default function SettingsPage() {
  const { showSuccess, showError } = useAlert();

  //  React Query hooks untuk data dan mutations
  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // UI Loading states
  const [imageLoading, setImageLoading] = useState(false);

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
    return (
      <div className="p-6 text-center">
        <HeaderDashboard title="Settings" />
        <div className="mt-8">
          <div className="text-red-600 mb-2">❌ Failed to load profile</div>
          <div className="text-sm text-gray-600 mb-4">
            {profileError.response?.data?.message || profileError.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
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

    try {
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
        showError("Tidak ada perubahan yang terdeteksi!");
        return;
      }

      //  Call backend update profile mutation
      await updateProfileMutation.mutateAsync(changes);
      showSuccess("Perubahan profil berhasil disimpan!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal menyimpan perubahan profil. Silakan coba lagi.";
      showError(errorMessage);
    }
  };

  //  Handle password change dengan backend integration
  const onChangePassword = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showError("Konfirmasi password tidak cocok!");
      return;
    }

    if (passwordFormData.newPassword.length < 8) {
      showError("Password baru harus minimal 8 karakter!");
      return;
    }

    if (!passwordFormData.currentPassword) {
      showError("Password saat ini harus diisi!");
      return;
    }

    try {
      //  Call backend change password mutation
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
        confirmPassword: passwordFormData.confirmPassword,
      });

      resetPasswordForm();
      showSuccess("Password berhasil diubah!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Gagal mengubah password. Silakan coba lagi.";
      showError(errorMessage);
    }
  };

  //  Handle image upload (masih menggunakan mock karena belum ada backend endpoint)
  const handleImageChange = async (file) => {
    setImageLoading(true);

    try {
      // TODO: Implement actual image upload to backend
      // const uploadUrl = await uploadToCloudStorage(file);

      // For demo: create object URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // TODO: Update profile dengan image URL di backend
      showSuccess("Foto profil berhasil diupload!");
    } catch (error) {
      showError("Gagal mengunggah foto profil. Silakan coba lagi.");
    } finally {
      setImageLoading(false);
    }
  };

  //  Handle image removal (masih menggunakan mock)
  const handleImageRemove = async () => {
    setImageLoading(true);

    try {
      // TODO: Implement actual image deletion from backend
      // await deleteFromCloudStorage(profile.profilePhoto);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess("Foto profil berhasil dihapus!");
    } catch (error) {
      showError("Gagal menghapus foto profil. Silakan coba lagi.");
    } finally {
      setImageLoading(false);
    }
  };

  //  Transform backend data untuk komponen UI
  const profileForUI = {
    name: profile?.fullName || profile?.username || "N/A",
    nip: profile?.nip || "N/A",
    nim: profile?.nim || "N/A",
    email: profile?.email || "N/A",
    faculty: profile?.faculty || "N/A",
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

          {/* <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Foto Profil
              </h3>
              <ProfileImageUpload
                currentImage={profileForUI.profilePhoto}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                loading={imageLoading}
              />
            </CardContent>
          </Card> */}
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
          lastUpdated={
            profile?.lastUpdatePassword
              ? new Date(profile.lastUpdatePassword).toLocaleDateString()
              : "Belum pernah diubah"
          }
        />
      </div>
    </>
  );
}
