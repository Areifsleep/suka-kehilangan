import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiEye,
  FiEdit3,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiMessageCircle,
  FiCheck,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { toast } from "react-toastify";

// Dummy data untuk laporan pengguna
const userReports = [
  {
    id: 1,
    title: "Kunci Motor Yamaha",
    description:
      "Kunci motor Yamaha dengan gantungan doraemon. Hilang saat parkir di area fakultas.",
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
    description:
      "Dompet kulit hitam merk fossil. Berisi KTM, KTP dan beberapa kartu.",
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
    description:
      "Jaket hoodie hitam ukuran L merk Uniqlo. Ada logo kecil di bagian dada.",
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
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {report.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                  report.status
                )}`}
              >
                {getStatusIcon(report.status)}
                {report.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">
              {report.description}
            </p>
          </div>
        </div>

        {/* Status spesial untuk barang yang sudah ditemukan */}
        {report.status === "Ditemukan" && report.foundLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-blue-800">
              <FiCheck className="w-4 h-4" />
              <span className="text-sm font-medium">
                Barang sudah ditemukan di: {report.foundLocation}
              </span>
            </div>
          </div>
        )}

        {/* Meta information */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            <span>{report.reportDate}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex gap-4">
            <div className="flex items-center gap-1 text-gray-500">
              <FiEye className="w-4 h-4" />
              <span>{report.views} views</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <FiMessageCircle className="w-4 h-4" />
              <span>{report.responses} respon</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            Update terakhir: {report.lastUpdate}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(report)}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiEye className="w-4 h-4 mr-2" />
            Lihat
          </Button>

          {report.status === "Aktif" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(report)}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <FiEdit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(report)}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <FiTrash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
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

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Laporan</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-sm text-gray-600">Aktif</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.found}</div>
          <div className="text-sm text-gray-600">Ditemukan</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
          <div className="text-sm text-gray-600">Kedaluwarsa</div>
        </CardContent>
      </Card>
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
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus laporan "${report.title}"?`
      )
    ) {
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
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard
        title="Laporan Saya"
        subtitle="Kelola semua laporan kehilangan barang yang Anda buat"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <StatsCards reports={reports} />

        {/* Header with filter and add button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Daftar Laporan
            </h2>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {filterOptions.map((option) => (
                <Button
                  key={option}
                  variant={filter === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(option)}
                  className={`${
                    filter === option
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={() => navigate("/user/report")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Buat Laporan Baru
          </Button>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={handleViewReport}
                onEdit={handleEditReport}
                onDelete={handleDeleteReport}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiMessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "Semua"
                ? "Belum Ada Laporan"
                : `Tidak Ada Laporan ${filter}`}
            </h3>
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
              Buat Laporan Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
