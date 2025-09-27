import React, { useState, useEffect } from "react";
import { FiUsers, FiUserCheck, FiFileText, FiSearch } from "react-icons/fi";

import { getInitials } from "@/utils/initials";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

// Small presentational components (replace with your shadcn equivalents if you have them)
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-bold">{value}</div>
    </div>
  );
}

function ActivityItem({ item }) {
  const bgMap = {
    info: "bg-gray-200",
    success: "bg-green-200",
    danger: "bg-red-200",
  };

  return (
    <div className="flex items-start gap-4 py-4 border-b last:border-b-0">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgMap[item.type] || "bg-gray-200"}`}>{item.icon}</div>
      <div className="flex-1">
        <div className="font-medium">{item.title}</div>
        <div className="text-sm text-gray-500">{item.subtitle}</div>
        <div className="text-xs text-gray-400 mt-1">{item.time}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ reports: 0, found: 0, claimed: 0, officers: 0 });
  const [activities, setActivities] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    // fetch('/api/admin/dashboard').then(r=>r.json()).then(data=>{ setStats(data.stats); setActivities(data.activities) })

    // Data dongo eh dummy
    setStats({ reports: 500, found: 500, claimed: 500, officers: 500 });
    setActivities([
      {
        id: 1,
        type: "info",
        title: "Handphone ditemukan di Masjid UIN",
        subtitle: "Dilaporkan oleh Satpam X",
        time: "5 menit yang lalu",
        icon: <FiSearch />,
      },
      {
        id: 2,
        type: "success",
        title: "Handphone telah dikembalikan kepada pemilik",
        subtitle: "Diverifikasi oleh Satpam X",
        time: "6 menit yang lalu",
        icon: <FiUserCheck />,
      },
      {
        id: 3,
        type: "danger",
        title: "Handphone dilaporkan hilang",
        subtitle: "Dilaporkan oleh User X",
        time: "20 menit yang lalu",
        icon: <FiFileText />,
      },
      {
        id: 4,
        type: "danger",
        title: "Handphone dilaporkan hilang",
        subtitle: "Dilaporkan oleh User X",
        time: "20 menit yang lalu",
        icon: <FiFileText />,
      },
    ]);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h2 className="relative w-max text-lg font-semibold pb-2">
            Dashboard
            <span className="absolute bottom-0 left-0 h-[4px] w-full rounded-full bg-green-700"></span>
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 hidden md:block">{user.full_name ? user.full_name : "Nama Seorang Admin"}</div>
          <Avatar className="size-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-800">
            {getInitials(user.full_name)}
          </Avatar>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Laporan"
          value={stats.reports}
          icon={<FiFileText />}
        />
        <StatCard
          title="Barang Ditemukan"
          value={stats.found}
          icon={<FiSearch />}
        />
        <StatCard
          title="Sudah Diambil"
          value={stats.claimed}
          icon={<FiUserCheck />}
        />
        <StatCard
          title="Petugas Aktif"
          value={stats.officers}
          icon={<FiUsers />}
        />
      </div>

      <Card>
        <CardContent>
          <h3 className="font-medium mb-4">Aktivitas Terkini</h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {activities.map((a) => (
              <ActivityItem
                key={a.id}
                item={a}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
