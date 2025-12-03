import { useProfile } from "@/features/profile-settings/queries/useProfileSettingsQuery";
import { ProfileCard, EditProfileForm, ChangePasswordForm, SettingsSkeleton } from "@/features/profile-settings/components";

export default function ProfileSettingsPage() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile();

  if (profileLoading) {
    return <SettingsSkeleton />;
  }

  if (profileError) {
    throw new Error("Gagal memuat data profil. Silahkan coba lagi.");
  }

  const profileForUI = {
    name: profile?.fullName || profile?.username || "N/A",
    nip: profile?.nip,
    nim: profile?.nim,
    email: profile?.email || "N/A",
    faculty: profile?.faculty || "N/A",
    facultyAbbreviation: profile?.facultyAbbreviation || "N/A",
    program: profile?.studyProgram || "N/A",
    profilePhoto: null,
    role: profile?.role || "N/A",
    username: profile?.username || "N/A",
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6 scrollbar-gutter-stable">
        <ProfileCard profile={profileForUI} />
        <EditProfileForm profile={profile} />
        <ChangePasswordForm
          lastUpdated={profile?.lastUpdatePassword ? new Date(profile.lastUpdatePassword).toLocaleDateString() : "Belum pernah diubah"}
        />
      </div>
    </>
  );
}
