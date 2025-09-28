import React, { useState, useEffect } from "react";
import {
  FiFileText,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiAlertCircle,
  FiCheck,
  FiX,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// StatusBadge component
function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "menunggu":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: FiClock,
        };
      case "diproses":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: FiEye,
        };
      case "ditemukan":
        return {
          color: "bg-green-100 text-green-800",
          icon: FiCheck,
        };
      case "ditutup":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: FiX,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: FiAlertCircle,
        };
    }
  };

  const config = getStatusConfig(status);
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
    >
      <IconComponent className="text-xs" />
      {status}
    </span>
  );
}

// ReportCard component
function ReportCard({ report, onView, onEdit, onDelete }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {report.itemName}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <StatusBadge status={report.status} />
              <span className="text-sm text-gray-500">#{report.id}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-red-500" />
            <span>{report.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            <span>Dilaporkan: {report.reportDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-purple-500" />
            <span>Hilang: {report.lostDate}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 text-sm line-clamp-2">
            {report.description}
          </p>
        </div>

        {report.lastUpdate && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Update terbaru:</strong> {report.lastUpdate}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2">
            <button
              onClick={() => onView(report)}
              className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Lihat Detail"
            >
              <FiEye />
            </button>
            {(report.status === "Menunggu" || report.status === "Diproses") && (
              <>
                <button
                  onClick={() => onEdit(report)}
                  className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  title="Edit Laporan"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => onDelete(report)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Hapus Laporan"
                >
                  <FiTrash2 />
                </button>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500">{report.category}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// DetailModal component
function DetailModal({ report, isOpen, onClose }) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {report.itemName}
              </h2>
              <div className="flex items-center gap-3">
                <StatusBadge status={report.status} />
                <span className="text-sm text-gray-500">#{report.id}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Informasi Barang</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-600">Kategori:</span>
                <span>{report.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="text-red-500" />
                <span className="font-medium text-gray-600">Lokasi:</span>
                <span>{report.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-blue-500" />
                <span className="font-medium text-gray-600">
                  Tanggal Hilang:
                </span>
                <span>{report.lostDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-purple-500" />
                <span className="font-medium text-gray-600">Waktu:</span>
                <span>{report.lostTime || "Tidak diketahui"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Deskripsi</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Informasi Kontak</h3>
            <div className="space-y-2 text-sm">
              {report.contactName && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Nama:</span>
                  <span>{report.contactName}</span>
                </div>
              )}
              {report.contactPhone && (
                <div className="flex items-center gap-2">
                  <FiPhone className="text-green-500" />
                  <span className="font-medium text-gray-600">Telepon:</span>
                  <span>{report.contactPhone}</span>
                </div>
              )}
              {report.contactEmail && (
                <div className="flex items-center gap-2">
                  <FiMail className="text-blue-500" />
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{report.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    Laporan Dibuat
                  </div>
                  <div className="text-gray-600">{report.reportDate}</div>
                </div>
              </div>
              {report.status !== "Menunggu" && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      Status Diperbarui
                    </div>
                    <div className="text-gray-600">
                      Menjadi: {report.status}
                    </div>
                  </div>
                </div>
              )}
              {report.lastUpdate && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      Update Terbaru
                    </div>
                    <div className="text-gray-600">{report.lastUpdate}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Semua");

  const statusOptions = [
    "Semua",
    "Menunggu",
    "Diproses",
    "Ditemukan",
    "Ditutup",
  ];

  // Dummy data
  useEffect(() => {
    const dummyReports = [
      {
        id: "LH001234",
        itemName: "Dompet Kulit Coklat",
        category: "Tas & Dompet",
        status: "Diproses",
        location: "Perpustakaan Pusat",
        lostDate: "2025-09-25",
        lostTime: "14:30",
        reportDate: "25 September 2025",
        description:
          "Dompet kulit coklat berisi kartu identitas dan uang tunai. Hilang saat berkunjung ke perpustakaan lantai 2.",
        contactName: "Ahmad Rizki",
        contactPhone: "081234567890",
        contactEmail: "ahmad.rizki@example.com",
        lastUpdate: "Petugas sedang memeriksa CCTV area perpustakaan",
      },
      {
        id: "LH001235",
        itemName: "Kunci Motor Yamaha",
        category: "Kunci",
        status: "Ditemukan",
        location: "Parkiran Fakultas Teknik",
        lostDate: "2025-09-24",
        lostTime: "16:00",
        reportDate: "24 September 2025",
        description:
          "Kunci motor Yamaha dengan gantungan berbentuk boneka kecil berwarna merah.",
        contactName: "Ahmad Rizki",
        contactPhone: "081234567890",
        contactEmail: "ahmad.rizki@example.com",
        lastUpdate:
          "Barang telah ditemukan! Silakan datang ke Security Fakultas Teknik untuk pengambilan.",
      },
      {
        id: "LH001236",
        itemName: "Tas Ransel Hitam Adidas",
        category: "Tas & Dompet",
        status: "Menunggu",
        location: "Kantin Pusat",
        lostDate: "2025-09-23",
        lostTime: "12:30",
        reportDate: "23 September 2025",
        description:
          "Tas ransel hitam merek Adidas berisi buku kuliah dan laptop. Tertinggal di meja kantin saat makan siang.",
        contactName: "Ahmad Rizki",
        contactPhone: "081234567890",
        contactEmail: "ahmad.rizki@example.com",
        lastUpdate: null,
      },
    ];

    setTimeout(() => {
      setReports(dummyReports);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter((report) =>
    filterStatus === "Semua" ? true : report.status === filterStatus
  );

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleEditReport = (report) => {
    alert(
      `Edit laporan: ${report.itemName}\n\nFitur ini akan mengarahkan ke form edit laporan.`
    );
  };

  const handleDeleteReport = (report) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus laporan "${report.itemName}"?`
      )
    ) {
      setReports((prev) => prev.filter((r) => r.id !== report.id));
      alert("Laporan berhasil dihapus!");
    }
  };

  // Statistics
  const stats = {
    total: reports.length,
    waiting: reports.filter((r) => r.status === "Menunggu").length,
    processed: reports.filter((r) => r.status === "Diproses").length,
    found: reports.filter((r) => r.status === "Ditemukan").length,
  };

  return (
    <div className="space-y-6">
      <HeaderDashboard
        title="Laporan Saya"
        subtitle="Pantau status laporan kehilangan yang telah Anda kirim"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Laporan</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.waiting}
              </div>
              <div className="text-sm text-gray-600">Menunggu</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.processed}
              </div>
              <div className="text-sm text-gray-600">Diproses</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.found}
              </div>
              <div className="text-sm text-gray-600">Ditemukan</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filter Status</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card>
          <CardContent className="p-12 text-center">
            <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === "Semua"
                ? "Belum ada laporan"
                : `Tidak ada laporan dengan status "${filterStatus}"`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === "Semua"
                ? "Anda belum membuat laporan kehilangan. Mulai laporkan barang yang hilang."
                : "Coba ubah filter atau buat laporan baru."}
            </p>
            <button
              onClick={() => (window.location.href = "/user/report")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Buat Laporan Baru
            </button>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <DetailModal
        report={selectedReport}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedReport(null);
        }}
      />
    </div>
  );
}
