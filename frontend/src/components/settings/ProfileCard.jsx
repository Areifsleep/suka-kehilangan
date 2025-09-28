import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const ProfileCard = ({ profile }) => {
  const getInitials = (name) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-gray-200 rounded-md flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 flex-shrink-0 overflow-hidden">
            {profile.profilePhoto ? (
              <img 
                src={profile.profilePhoto} 
                alt={`Foto profil ${profile.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback ke initial jika gambar gagal dimuat
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full flex items-center justify-center ${profile.profilePhoto ? 'hidden' : 'flex'}`}
            >
              {getInitials(profile.name)}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left w-full">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 md:mb-3">{profile.name}</h3>
            <div className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium sm:min-w-[120px]">NIP</span>
                <span className="sm:ml-2">: {profile.nip}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium sm:min-w-[120px]">Email</span>
                <span className="sm:ml-2 break-all">: {profile.email}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium sm:min-w-[120px]">Fakultas</span>
                <span className="sm:ml-2">: {profile.faculty}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center">
                <span className="font-medium sm:min-w-[120px]">Program studi</span>
                <span className="sm:ml-2">: {profile.program}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};