import React, { useState, useEffect } from "react";
import { FiMenu, FiHome, FiUsers, FiUserCheck, FiFileText, FiSettings, FiLogOut, FiSearch } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import UIN from "@/assets/UIN.png";

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
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgMap[item.type] || "bg-gray-200"}`}>
        {item.icon}
      </div>
      <div className="flex-1">
        <div className="font-medium">{item.title}</div>
        <div className="text-sm text-gray-500">{item.subtitle}</div>
        <div className="text-xs text-gray-400 mt-1">{item.time}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [stats, setStats] = useState({ reports: 0, found: 0, claimed: 0, officers: 0 });
  const [activities, setActivities] = useState([]);

  useEffect(() => {    
    // fetch('/api/admin/dashboard').then(r=>r.json()).then(data=>{ setStats(data.stats); setActivities(data.activities) })

    // Data dongo eh dummy
    setStats({ reports: 500, found: 500, claimed: 500, officers: 500 });
    setActivities([
      { id: 1, type: "info", title: "Handphone ditemukan di Masjid UIN", subtitle: "Dilaporkan oleh Satpam X", time: "5 menit yang lalu", icon: <FiSearch /> },
      { id: 2, type: "success", title: "Handphone telah dikembalikan kepada pemilik", subtitle: "Diverifikasi oleh Satpam X", time: "6 menit yang lalu", icon: <FiUserCheck /> },
      { id: 3, type: "danger", title: "Handphone dilaporkan hilang", subtitle: "Dilaporkan oleh User X", time: "20 menit yang lalu", icon: <FiFileText /> },
      { id: 4, type: "danger", title: "Handphone dilaporkan hilang", subtitle: "Dilaporkan oleh User X", time: "20 menit yang lalu", icon: <FiFileText /> },
    ]);
  }, []);

  const menu = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "users", label: "Manajemen User", icon: <FiUsers /> },
    { key: "officers", label: "Manajemen Petugas", icon: <FiUserCheck /> },
    { key: "reports", label: "Laporan", icon: <FiFileText /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-white border-r transition-all duration-200 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <img
                    src={UIN}
                    alt="UIN Sunan Kalijaga Logo"
                    className="mb-4 object-contain"
                    style={{ width: "40px", height: "40px", maxWidth: "40px", maxHeight: "40px" }}
                />
              </div>
              <div>
                <div className="text-sm font-semibold">SUKA KEHILANGAN</div>
              </div>
            </div>
          )}

          <button className="p-2 rounded hover:bg-gray-100" onClick={() => setCollapsed((c) => !c)} aria-label="toggle sidebar">
            <FiMenu />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menu.map((m) => {
            const isActive = active === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActive(m.key)}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-lg transition-colors duration-150 ${
                  isActive ? "bg-green-200 text-black" : "text-gray-700 hover:bg-green-100"
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                {!collapsed && <span className="font-medium">{m.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4">
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100">
            <FiSettings /> {!collapsed && <span>Settings</span>}
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-green-100 mt-2">
            <FiLogOut /> {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">Dashboard</h2>
            <div className="w-20 h-1 bg-green-700 rounded mt-2"></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 hidden md:block">Nama Seorang Admin</div>
            <Avatar className="w-10 h-10 bg-gray-200 rounded-full" />
          </div>
        </header>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Laporan" value={stats.reports} icon={<FiFileText />} />
          <StatCard title="Barang Ditemukan" value={stats.found} icon={<FiSearch />} />
          <StatCard title="Sudah Diambil" value={stats.claimed} icon={<FiUserCheck />} />
          <StatCard title="Petugas Aktif" value={stats.officers} icon={<FiUsers />} />
        </div>

        <Card>
          <CardContent>
            <h3 className="font-medium mb-4">Aktivitas Terkini</h3>
            <div className="bg-white rounded-lg shadow-sm p-4">
              {activities.map((a) => (
                <ActivityItem key={a.id} item={a} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
