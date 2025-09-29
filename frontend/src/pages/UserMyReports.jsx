import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiEye, FiEdit3, FiTrash2, FiMapPin, FiCalendar, FiClock, FiMessageCircle, FiCheck, FiX, FiPlus, FiFileText, FiFilter } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { toast } from "react-toastify";

// Dummy data untuk laporan pengguna
const userReports = [
  {
    id: 1,
    title: "Kunci Motor Yamaha",
    description: "Kunci motor Yamaha dengan gantungan doraemon. Hilang saat parkir di area fakultas.",
    status: "Aktif",
    location: "Area Parkir Fakultas",
    reportDate: "20 September 2025",
    reportTime: "14:30",
    views: 25,
    responses: 2,
    lastUpdate: "21 September 2025",
    category: "Kunci",
  },
  {
    id: 2,
    title: "Dompet Kulit Hitam",
    description: "Dompet kulit hitam merk fossil. Berisi KTM, KTP dan beberapa kartu.",
    status: "Ditemukan",
    location: "Perpustakaan",
    reportDate: "18 September 2025",
    reportTime: "10:15",
    views: 45,
    responses: 1,
    lastUpdate: "22 September 2025",
    category: "Dompet",
    foundLocation: "Pos Satpam Perpustakaan",
  },
  {
    id: 3,
    title: "Jaket Hoodie Hitam",
    description: "Jaket hoodie hitam ukuran L merk Uniqlo. Ada logo kecil di bagian dada.",
    status: "Expired",
    location: "Ruang Kuliah A.302",
    reportDate: "10 September 2025",
    reportTime: "08:00",
    views: 12,
    responses: 0,
    lastUpdate: "10 September 2025",
    category: "Pakaian",
  },
];

// Status color helper
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "aktif":
      return "bg-green-100 text-green-800 border-green-200";
    case "ditemukan":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "expired":
      return "bg-red-100 text-red-800 border-red-200";
    case "ditutup":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "aktif":
      return <FiClock className="w-4 h-4" />;
    case "ditemukan":
      return <FiCheck className="w-4 h-4" />;
    case "expired":
    case "ditutup":
      return <FiX className="w-4 h-4" />;
    default:
      return <FiClock className="w-4 h-4" />;
  }
};

// Report Card Component
function ReportCard({ report, onView, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Status indicator */}
          <div className="w-full md:w-2 bg-gradient-to-b from-green-400 to-blue-500 flex-shrink-0"></div>

          {/* Main content */}
          <div className="flex-1 p-5">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">{report.title}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                        {report.category}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>

                {/* Status khusus untuk barang ditemukan */}
                {report.status === "Ditemukan" && report.foundLocation && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FiCheck className="w-4 h-4" />
                      <span className="text-sm font-medium">Ditemukan di: {report.foundLocation}</span>
                    </div>
                  </div>
                )}

                {/* Meta info - horizontal layout */}
                <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-blue-600" />
                    <span>{report.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-green-600" />
                    <span>{report.reportDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiEye className="w-4 h-4 text-purple-600" />
                    <span>{report.views} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMessageCircle className="w-4 h-4 text-orange-600" />
                    <span>{report.responses} respon</span>
                  </div>
                </div>

                <div className="text-xs text-gray-400 mb-3">Update terakhir: {report.lastUpdate}</div>
              </div>

              {/* Right actions */}
              <div className="flex md:flex-col gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(report)}
                  className="text-gray-700 hover:bg-gray-50 min-w-[80px]"
                >
                  <FiEye className="w-4 h-4 mr-1" />
                  Lihat
                </Button>

                {report.status === "Aktif" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(report)}
                    className="text-blue-700 hover:bg-blue-50 min-w-[80px]"
                  >
                    <FiEdit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(report)}
                  className="text-red-700 hover:bg-red-50 min-w-[80px]"
                >
                  <FiTrash2 className="w-4 h-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stats Cards Component
function StatsCards({ reports }) {
  const stats = {
    total: reports.length,
    active: reports.filter((r) => r.status === "Aktif").length,
    found: reports.filter((r) => r.status === "Ditemukan").length,
    expired: reports.filter((r) => r.status === "Expired").length,
  };

  const statItems = [
    {
      value: stats.total,
      label: "Total Laporan",
      color: "text-gray-600",
      bg: "bg-gray-100",
      icon: <FiFileText className="w-5 h-5" />,
    },
    {
      value: stats.active,
      label: "Aktif",
      color: "text-green-600",
      bg: "bg-green-100",
      icon: <FiClock className="w-5 h-5" />,
    },
    {
      value: stats.found,
      label: "Ditemukan",
      color: "text-blue-600",
      bg: "bg-blue-100",
      icon: <FiCheck className="w-5 h-5" />,
    },
    {
      value: stats.expired,
      label: "Kedaluwarsa",
      color: "text-red-600",
      bg: "bg-red-100",
      icon: <FiX className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className="bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>{item.icon}</div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function UserMyReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(userReports);
  const [filter, setFilter] = useState("Semua");

  // Filter reports based on status
  const filteredReports = reports.filter((report) => {
    if (filter === "Semua") return true;
    return report.status === filter;
  });

  const handleViewReport = (report) => {
    navigate(`/user/item/${report.id}`);
  };

  const handleEditReport = (report) => {
    // Navigate to edit form
    navigate(`/user/report/edit/${report.id}`);
  };

  const handleDeleteReport = async (report) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan "${report.title}"?`)) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setReports((prev) => prev.filter((r) => r.id !== report.id));
        toast.success("Laporan berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus laporan");
      }
    }
  };

  const filterOptions = ["Semua", "Aktif", "Ditemukan", "Expired"];

  return (
    <>
      <HeaderDashboard
        title="Laporan Saya"
        subtitle="Kelola semua laporan kehilangan barang yang Anda buat"
      />

      <div>
        {/* Stats */}
        <StatsCards reports={reports} />

        {/* Header with filter and add button */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-green-600" />
                Daftar Laporan
              </h2>

              {/* Filter buttons */}
              <div className="flex gap-2 flex-wrap">
                {filterOptions.map((option) => {
                  const isActive = filter === option;
                  return (
                    <Button
                      key={option}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter(option)}
                      className={`transition-colors ${
                        isActive
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400"
                      }`}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={() => navigate("/user/report")}
              className="bg-green-600 hover:bg-green-700 text-white transition-colors flex-shrink-0"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Buat Laporan Baru
            </Button>
          </div>
        </div>

        {/* Reports List */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <div
                key={report.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ReportCard
                  report={report}
                  onView={handleViewReport}
                  onEdit={handleEditReport}
                  onDelete={handleDeleteReport}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiMessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{filter === "Semua" ? "Belum Ada Laporan" : `Tidak Ada Laporan ${filter}`}</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {filter === "Semua"
                ? "Anda belum membuat laporan kehilangan. Mulai buat laporan untuk barang yang hilang."
                : `Tidak ada laporan dengan status ${filter.toLowerCase()}.`}
            </p>
            <Button
              onClick={() => navigate("/user/report")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              {filter === "Semua" ? "Buat Laporan Pertama" : "Buat Laporan Baru"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
