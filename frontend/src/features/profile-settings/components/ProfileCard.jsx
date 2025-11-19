import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/utils/initials";

export const ProfileCard = ({ profile }) => {
  const isValidValue = (value) => {
    return value && value !== null && value !== "N/A" && value !== "" && value !== undefined;
  };

  const buildProfileFields = () => {
    const fields = [];
    const hasNim = isValidValue(profile.nim);
    const hasNip = isValidValue(profile.nip);

    if (!hasNim && hasNip) {
      fields.push({ label: "NIP", value: profile.nip });
    } else if (hasNim && !hasNip) {
      fields.push({ label: "NIM", value: profile.nim });
    }

    if (isValidValue(profile.role)) {
      fields.push({ label: "Role", value: profile.role });
    }

    if (isValidValue(profile.email)) {
      fields.push({ label: "Email", value: profile.email, breakAll: true });
    }

    if (isValidValue(profile.faculty)) {
      fields.push({
        label: "Fakultas",
        value: `${profile.faculty} (${profile.facultyAbbreviation})`,
      });
    }

    if (isValidValue(profile.program)) {
      fields.push({ label: "Program Studi", value: profile.program });
    }

    return fields;
  };

  const profileFields = buildProfileFields();

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6">
          {/* Kolom Foto Profil */}
          <div className="flex-shrink-0 relative">
            {/* Kontainer Foto Profil (tetap kotak) */}
            <div className="w-28 h-28 lg:w-36 lg:h-36 bg-slate-200 rounded-md flex items-center justify-center text-green-800 text-4xl lg:text-5xl font-bold">
              {getInitials(profile.name)}
            </div>
            {/* Indikator Status */}
            <span
              className="absolute bottom-2 right-2 block h-4 w-4 rounded-full bg-green-500 border-2 border-white"
              title="Status: Aktif"
            ></span>
          </div>

          {/* Kolom Informasi Profil */}
          <div className="flex-1 w-full flex flex-col">
            {/* Bagian Header Info (Nama & Peran) */}
            <div className="text-center md:text-left mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                {profile.nim ? "Mahasiswa" : profile.nip ? "Dosen" : profile.role == "PETUGAS" ? "Petugas Satpam" : "Administrator"}
              </p>
            </div>

            {/* Bagian Detail Info */}
            {profileFields.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <dl className="divide-y divide-slate-200">
                  {profileFields.map((field) => (
                    <div
                      key={field.label}
                      className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 sm:gap-4 items-center"
                    >
                      <dt className="text-sm font-medium text-slate-500">{field.label}</dt>
                      <dd className={`text-sm text-slate-900 mt-1 sm:mt-0 sm:col-span-2 ${field.breakAll ? "break-all" : ""}`}>{field.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center md:text-left">Tidak ada informasi profil tambahan.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

//  <CardContent className="p-4 sm:p-6">
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
//           {/* Profile Photo */}
//           <div className="flex-shrink-0">
//             <div className="w-20 h-20 lg:w-[168px] lg:h-[168px] bg-[#d9d9d9] rounded-[6px] flex items-center justify-center text-[#035d37] text-xl l lg:text-7xl font-semibold">
//               {getInitials(profile.name)}
//             </div>
//           </div>

//           {/* Profile Info */}
//           <div className="flex-1 text-center md:text-left w-full">
//             <h3 className="text-lg md:text-xl font-semibold mb-5 lg:mb-2">{profile.name}</h3>

//             {profileFields.length > 0 ? (
//               <>
//                 {/* Mobile view: kotak-kotak */}
//                 <div className="grid grid-cols-1 gap-2 sm:hidden">
//                   {profileFields.map((field, index) => (
//                     <div
//                       key={index}
//                       className="border rounded-md p-2 text-left text-sm bg-gray-50"
//                     >
//                       <span className="block font-medium text-gray-600">{field.label}</span>
//                       <span className={`block mt-1 ${field.breakAll ? "break-all" : ""}`}>{field.value}</span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Desktop view: tabel baris */}
//                 <div className="hidden sm:block space-y-2 text-sm md:text-base text-gray-700">
//                   {profileFields.map((field, index) => (
//                     <div
//                       key={index}
//                       className="flex flex-col sm:flex-row sm:items-center"
//                     >
//                       <span className="font-medium sm:min-w-[120px] text-gray-600">{field.label}</span>
//                       <span className={`sm:ml-2 ${field.breakAll ? "break-all" : ""}`}>: {field.value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             ) : (
//               <p className="text-xs sm:text-sm text-gray-500">No additional profile information available</p>
//             )}
//           </div>
//         </div>
//       </CardContent>
