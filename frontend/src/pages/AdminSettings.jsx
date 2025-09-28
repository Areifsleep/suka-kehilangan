import React, { useState, useEffect } from "react";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { ProfileCard, EditProfileForm, ChangePasswordForm, ProfileImageUpload } from "@/components/settings";
import { useAlert } from "@/components/AlertProvider";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminSettings() {
  const { showSuccess, showError } = useAlert();

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // mock profile data
  const [profile, setProfile] = useState({
    name: "Ahmad Suherman",
    nip: "23106050100",
    email: "23106050100@student.uin-suka.ac.id",
    faculty: "Fakultas Sains dan Teknologi",
    program: "Informatika",
    profilePhoto: null, // Bisa diisi dengan URL foto profil, contoh: "https://example.com/photo.jpg"
  });

  // Profile form state (similar to EditPetugasModal)
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
  });

  // Password form state (similar to EditPetugasModal)
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize form data when profile changes
  useEffect(() => {
    setProfileFormData({
      name: profile.name,
      email: profile.email,
    });
  }, [profile]);

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

  // Handle image upload
  const handleImageChange = async (file) => {
    setImageLoading(true);

    try {
      // const uploadUrl = await uploadToCloudStorage(file);

      // For demo: create object URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProfile((prev) => ({
        ...prev,
        profilePhoto: imageUrl,
      }));
    } catch {
      showError("Gagal mengunggah foto profil. Silakan coba lagi.");
    } finally {
      setImageLoading(false);
    }
  };

  // Handle image removal
  const handleImageRemove = async () => {
    setImageLoading(true);

    try {
      // await deleteFromCloudStorage(profile.profilePhoto);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Revoke object URL to prevent memory leaks
      if (profile.profilePhoto && profile.profilePhoto.startsWith("blob:")) {
        URL.revokeObjectURL(profile.profilePhoto);
      }

      setProfile((prev) => ({
        ...prev,
        profilePhoto: null,
      }));
    } catch {
      showError("Gagal menghapus foto profil. Silakan coba lagi.");
    } finally {
      setImageLoading(false);
    }
  };

  const onSaveInfo = async (e) => {
    e.preventDefault();
    setProfileLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // in real app: call API to save profile
      setProfile((p) => ({ ...p, name: profileFormData.name, email: profileFormData.email }));
      showSuccess("Perubahan profil berhasil disimpan!");
    } catch {
      showError("Gagal menyimpan perubahan profil. Silakan coba lagi.");
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      showError("Konfirmasi password tidak cocok!");
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      showError("Password baru harus minimal 6 karakter!");
      return;
    }

    setPasswordLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // real app: call API to change password
      resetPasswordForm();
      showSuccess("Password berhasil diubah!");
    } catch {
      showError("Gagal mengubah password. Silakan coba lagi.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <HeaderDashboard title="Settings" />

      <div className="space-y-4 sm:space-y-6 scrollbar-gutter-stable">
        {/* Profile Card with Image Upload */}
        <div className="space-y-4">
          <ProfileCard profile={profile} />

          {/* Photo Upload Section */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Foto Profil</h3>
              <ProfileImageUpload
                currentImage={profile.profilePhoto}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                loading={imageLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Form */}
        <EditProfileForm
          formData={profileFormData}
          onInputChange={handleProfileInputChange}
          onSubmit={onSaveInfo}
          loading={profileLoading}
        />

        {/* Change Password Form */}
        <ChangePasswordForm
          formData={passwordFormData}
          onInputChange={handlePasswordInputChange}
          onSubmit={onChangePassword}
          loading={passwordLoading}
          lastUpdated="26 September 2025"
        />
      </div>
    </>
  );
}
