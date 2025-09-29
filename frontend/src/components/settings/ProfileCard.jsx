import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/utils/initials";

/**
 * ProfileCard - Komponen untuk menampilkan kartu profil pengguna
 *
 * Catatan: Layout shift prevention sudah diterapkan di level global melalui:
 * 1. CSS `scrollbar-gutter: stable` di html dan body
 * 2. Utility classes `scrollbar-gutter-stable`, `prevent-shift` tersedia
 * 3. BaseLayout dan container utama sudah menggunakan classes tersebut
 */
// frontend/src/components/settings/ProfileCard.jsx - Alternative version
export const ProfileCard = ({ profile }) => {
  // Function untuk cek apakah value valid
  const isValidValue = (value) => {
    return (
      value &&
      value !== null &&
      value !== "N/A" &&
      value !== "" &&
      value !== undefined
    );
  };

  // Build array of profile fields yang akan ditampilkan
  const buildProfileFields = () => {
    const fields = [];

    // Username (always show if valid)
    if (isValidValue(profile.username)) {
      fields.push({ label: "Username", value: profile.username });
    }

    // Role (always show if valid)
    if (isValidValue(profile.role)) {
      fields.push({ label: "Role", value: profile.role });
    }

    // ID field based on role
    if (profile.role === "USER" && isValidValue(profile.nim)) {
      fields.push({ label: "NIM", value: profile.nim });
    } else if (
      (profile.role === "PETUGAS" || profile.role === "ADMIN") &&
      isValidValue(profile.nip)
    ) {
      fields.push({ label: "NIP", value: profile.nip });
    }

    // Email
    if (isValidValue(profile.email)) {
      fields.push({ label: "Email", value: profile.email, breakAll: true });
    }

    // Fakultas (mainly for students)
    if (isValidValue(profile.faculty)) {
      fields.push({ label: "Fakultas", value: profile.faculty });
    }

    // Program Studi (mainly for students)
    if (isValidValue(profile.program)) {
      fields.push({ label: "Program Studi", value: profile.program });
    }

    return fields;
  };

  const profileFields = buildProfileFields();

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 lg:size-[168px] sm:w-24 sm:h-24 bg-[#d9d9d9] rounded-[5px] flex items-center justify-center text-[#035d37] text-xl lg:text-7xl sm:text-2xl font-semibold">
              {getInitials(profile.name)}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3">
              {profile.name}
            </h3>

            {profileFields.length > 0 ? (
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                {profileFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center"
                  >
                    <span className="font-medium sm:min-w-[120px]">
                      {field.label}
                    </span>
                    <span
                      className={`sm:ml-2 ${field.breakAll ? "break-all" : ""}`}
                    >
                      : {field.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No additional profile information available
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
