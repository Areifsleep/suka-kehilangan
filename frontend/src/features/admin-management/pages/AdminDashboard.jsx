import { useState, useEffect } from "react";
import { FiUsers, FiUserCheck, FiFileText, FiSearch } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";

import { useDashboardStats, useDashboardActivities } from "../mutations/adminManagementMutations";

function StatCard({ title, value, icon, isLoading }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div className="text-xs text-gray-500">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="mt-4 text-2xl font-bold">{isLoading ? <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div> : value}</div>
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
        {item.type === "info" && <FiSearch />}
        {item.type === "success" && <FiUserCheck />}
        {item.type === "danger" && <FiFileText />}
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
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useDashboardActivities();

  return (
    <>
      {/* <HeaderDashboard title="Dashboard" /> */}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Laporan"
          value={stats?.reports || 0}
          icon={<FiFileText />}
          isLoading={statsLoading}
        />
        <StatCard
          title="Barang Ditemukan"
          value={stats?.found || 0}
          icon={<FiSearch />}
          isLoading={statsLoading}
        />
        <StatCard
          title="Sudah Diambil"
          value={stats?.claimed || 0}
          icon={<FiUserCheck />}
          isLoading={statsLoading}
        />
        <StatCard
          title="Petugas Aktif"
          value={stats?.officers || 0}
          icon={<FiUsers />}
          isLoading={statsLoading}
        />
      </div>

      <Card>
        <CardContent>
          <h3 className="font-medium mb-4">Aktivitas Terkini</h3>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-4"
                  >
                    <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 animate-pulse rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((a) => (
                <ActivityItem
                  key={a.id}
                  item={a}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Belum ada aktivitas terkini</div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
