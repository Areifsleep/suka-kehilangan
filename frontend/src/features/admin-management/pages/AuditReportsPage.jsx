import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiEye,
  FiTrendingUp,
  FiPackage,
  FiMapPin,
  FiClock,
  FiTag,
  FiFileText,
  FiX,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";

import { auditReportsApi } from "../api/auditReportsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { MdVolunteerActivism } from "react-icons/md";
import { XCircle } from "lucide-react";

function StatCard({ title, value, icon, bgColor = "bg-gray-100", iconColor = "text-gray-400", trend, trendValue }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-6 group">
      <div className="flex items-center justify-between">
        <div className="flex flex-col flex-1">
          <div className="text-sm text-gray-500 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {trend && (
            <div className={`flex items-center text-sm ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
              <FiTrendingUp className={`mr-1 text-xs ${trend === "down" ? "rotate-180" : ""}`} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
          <div className={`text-2xl ${iconColor}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function ItemAuditCard({ audit, onView }) {
  const statusConfig = {
    open: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
      label: "Terbuka",
    },
    claimed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
      label: "Diklaim",
    },
    closed: {
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-500",
      label: "Selesai",
    },
  };

  const typeConfig = {
    found: {
      color: "bg-green-50 text-green-700",
      label: "Ditemukan",
    },
    lost: {
      color: "bg-red-50 text-red-700",
      label: "Hilang",
    },
  };

  const config = statusConfig[audit.status] || statusConfig["open"];
  const typeStyle = typeConfig[audit.report_type] || typeConfig["found"];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-all duration-200">
      {/* Header dengan gambar dan nama barang */}
      <div className="flex items-start gap-3 mb-3">
        {audit.image_url ? (
          <img
            src={audit.image_url}
            alt={audit.item_name}
            className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border flex-shrink-0">
            <FiPackage className="text-gray-400 text-xl" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{audit.item_name}</h3>
          <p className="text-sm text-gray-500">{audit.category}</p>
          <div className="flex gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></div>
              {config.label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeStyle.color}`}>{typeStyle.label}</span>
          </div>
        </div>
      </div>

      {/* Info detail */}
      <div className="space-y-2 mb-3 text-sm">
        <div className="flex items-center text-gray-600">
          <FiCalendar className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{formatDate(audit.created_at)}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiUser className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">
            {audit.reporter_name} ({audit.reporter_role})
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{audit.location}</span>
        </div>
      </div>

      {/* Deskripsi */}
      {audit.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{audit.description}</p>}

      {/* Tombol detail */}
      <button
        onClick={() => onView(audit)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
      >
        <FiEye />
        <span>Lihat Detail</span>
      </button>
    </div>
  );
}

function ItemAuditRow({ audit, onView }) {
  const statusConfig = {
    open: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
      label: "Terbuka",
    },
    claimed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
      label: "Diklaim",
    },
    closed: {
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-500",
      label: "Selesai",
    },
  };

  const config = statusConfig[audit.status] || statusConfig["open"];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <span>{formatDate(audit.created_at)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{audit.item_name}</div>
            <div className="text-sm text-gray-500">{audit.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
          {config.label}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div>
            <div className="font-medium text-gray-900">{audit.reporter_name}</div>
            <div className="text-sm text-gray-500">{audit.reporter_role}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <FiMapPin className="mr-2 text-gray-400" />
          <span>{audit.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div
          className="max-w-xs truncate text-gray-700"
          title={audit.description}
        >
          {audit.description}
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => onView(audit)}
          className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors text-blue-600"
          title="Lihat Detail"
        >
          <FiEye className="text-sm" />
        </button>
      </td>
    </tr>
  );
}

function AuditDetailModal({ audit, isOpen, onClose }) {
  if (!audit) return null;

  const statusConfig = {
    open: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
      label: "Terbuka",
      icon: <FiAlertTriangle className="w-5 h-5" />,
    },
    claimed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
      label: "Diklaim",
      icon: <FiClock className="w-5 h-5" />,
    },
    closed: {
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-500",
      label: "Selesai",
      icon: <FiCheckCircle className="w-5 h-5" />,
    },
  };

  const typeConfig = {
    found: {
      color: "bg-green-50 text-green-700 border-green-200",
      label: "Barang Ditemukan",
    },
    lost: {
      color: "bg-red-50 text-red-700 border-red-200",
      label: "Barang Hilang",
    },
  };

  const config = statusConfig[audit.status] || statusConfig["open"];
  const typeStyle = typeConfig[audit.report_type] || typeConfig["found"];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <ModalBody className="p-0">
        {/* Image Section */}
        <div className="relative">
          {audit.image_url ? (
            <div className="relative h-80 bg-gray-100">
              <img
                src={audit.image_url}
                alt={audit.item_name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <FiPackage className="w-24 h-24 text-gray-400" />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <FiX className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{audit.item_name}</h2>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${config.color}`}>
                  {config.icon}
                  <span className="ml-2">{config.label}</span>
                </span>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${typeStyle.color}`}>{typeStyle.label}</span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-gray-200">
            {/* Kategori */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FiTag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Kategori</div>
                <div className="font-medium text-gray-900">{audit.category}</div>
              </div>
            </div>

            {/* Lokasi */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiMapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Lokasi Ditemukan</div>
                <div className="font-medium text-gray-900">{audit.location}</div>
              </div>
            </div>

            {/* Pelapor */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <FiUser className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Dilaporkan Oleh</div>
                <div className="font-medium text-gray-900">{audit.reporter_name}</div>
                <div className="text-sm text-gray-500">{audit.reporter_role}</div>
              </div>
            </div>

            {/* Tanggal Laporan */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Tanggal Laporan</div>
                <div className="font-medium text-gray-900">{formatDate(audit.created_at)}</div>
              </div>
            </div>

            {/* Pengambil (jika ada) */}
            {audit.claimed_by_name && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <FiUser className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Diambil Oleh</div>
                  <div className="font-medium text-gray-900">{audit.claimed_by_name}</div>
                </div>
              </div>
            )}

            {/* Tanggal Diambil (jika ada) */}
            {audit.claimed_at && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <FiClock className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Tanggal Diambil</div>
                  <div className="font-medium text-gray-900">{formatDate(audit.claimed_at)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          {audit.description && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Deskripsi</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{audit.description}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-gray-400" />
              Timeline
            </h3>
            <div className="space-y-3">
              {/* Created */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="w-0.5 h-full bg-blue-200 mt-1"></div>
                </div>
                <div className="pb-6">
                  <div className="font-medium text-gray-900">Laporan Dibuat</div>
                  <div className="text-sm text-gray-500">{formatDate(audit.created_at)}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Oleh {audit.reporter_name} ({audit.reporter_role})
                  </div>
                </div>
              </div>

              {/* Updated */}
              {audit.updated_at && audit.updated_at !== audit.created_at && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    {audit.claimed_at && <div className="w-0.5 h-full bg-yellow-200 mt-1"></div>}
                  </div>
                  <div className={audit.claimed_at ? "pb-6" : ""}>
                    <div className="font-medium text-gray-900">Laporan Diperbarui</div>
                    <div className="text-sm text-gray-500">{formatDate(audit.updated_at)}</div>
                  </div>
                </div>
              )}

              {/* Claimed */}
              {audit.claimed_at && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Barang Diambil</div>
                    <div className="text-sm text-gray-500">{formatDate(audit.claimed_at)}</div>
                    {audit.claimed_by_name && <div className="text-sm text-gray-600 mt-1">Oleh {audit.claimed_by_name}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          Tutup
        </button>
      </ModalFooter>
    </Modal>
  );
}

export default function AuditReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [page, setPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 20;

  // Debounce search term untuk mengurangi API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch audit statistics
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["auditStats"],
    queryFn: auditReportsApi.getAuditStats,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: auditReportsApi.getCategories,
  });

  // Build query params
  const buildQueryParams = () => {
    const params = {
      page,
      limit,
      dateRange,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filterStatus !== "all") params.status = filterStatus.toUpperCase();
    if (filterCategory !== "all") params.categoryId = filterCategory;

    return params;
  };

  // Build export params (tanpa page dan limit)
  const buildExportParams = () => {
    const params = {
      dateRange,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filterStatus !== "all") params.status = filterStatus.toUpperCase();
    if (filterCategory !== "all") params.categoryId = filterCategory;

    return params;
  };

  // Fetch audit reports
  const {
    data: reportsData,
    isLoading: reportsLoading,
    refetch: refetchReports,
  } = useQuery({
    queryKey: ["auditReports", page, debouncedSearchTerm, filterStatus, filterCategory, dateRange],
    queryFn: () => auditReportsApi.getAuditReports(buildQueryParams()),
  });

  const stats = statsData || {
    totalItems: 0,
    foundItems: 0,
    lostItems: 0,
    claimedItems: 0,
    returnedItems: 0,
    todayItems: 0,
    trends: {
      items: "up",
      itemsValue: "+0 dari kemarin",
    },
  };

  const reports = reportsData?.data || [];
  const pagination = reportsData?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  const categories = categoriesData || [];
  const loading = reportsLoading || statsLoading;

  // Reset page ke 1 ketika filter berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, filterStatus, filterCategory, dateRange]);

  const handleViewAudit = (audit) => {
    setSelectedAudit(audit);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAudit(null), 300); // Clear after animation
  };

  const handleRefresh = () => {
    refetchReports();
    refetchStats();
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("Memproses export PDF...");

      const response = await auditReportsApi.exportAuditReports(buildExportParams());

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = "laporan-audit.pdf";

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob from response data
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Laporan PDF berhasil diunduh!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengexport laporan. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  const statusTypes = [
    { value: "all", label: "Semua Status" },
    { value: "open", label: "Terbuka" },
    { value: "claimed", label: "Diklaim" },
    { value: "closed", label: "Selesai" },
  ];

  const categoryTypes = [{ value: "all", label: "Semua Kategori" }, ...categories.map((cat) => ({ value: cat.id, label: cat.name }))];

  const dateRanges = [
    { value: "all", label: "Semua" },
    { value: "today", label: "Hari Ini" },
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
  ];

  return (
    <>
      {/* <HeaderDashboard title="Laporan Audit" /> */}

      {/* Audit Detail Modal */}
      <AuditDetailModal
        audit={selectedAudit}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <div className="mb-12">
        {/* Stat cards sudah responsif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Barang"
            value={stats.totalItems}
            icon={<FiPackage />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Belum Diambil"
            value={stats.foundItems}
            icon={<XCircle className="stroke-red-500" />}
            bgColor="bg-red-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Telah Diambil"
            value={stats.claimedItems}
            icon={<MdVolunteerActivism />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
        </div>

        <Card className="shadow-sm border-0">
          <CardContent className="p-0">
            {/* Header dengan Search dan Filters - Dibuat responsif */}
            <div className="p-4 sm:p-6 border-b bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">Log Laporan Barang</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{pagination.total} log</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
                  >
                    <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting || loading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <FiDownload className={`text-sm ${isExporting ? "animate-bounce" : ""}`} />
                    <span className="hidden sm:inline">{isExporting ? "Memproses..." : "Export PDF"}</span>
                  </button>
                </div>
              </div>

              {/* Search and Filter Bar - Dibuat responsif */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama barang, kategori, lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {/* Filter dropdowns dibuat agar bisa wrap di layar kecil */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {statusTypes.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {categoryTypes.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    {dateRanges.map((range) => (
                      <option
                        key={range.value}
                        value={range.value}
                      >
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* --- Tampilan Desktop (Tabel) --- */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Barang</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pelapor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Detail</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center"
                      >
                        <div className="flex items-center justify-center">
                          <FiRefreshCw className="animate-spin mr-2" />
                          <span>Memuat data...</span>
                        </div>
                      </td>
                    </tr>
                  ) : reports.length > 0 ? (
                    reports.map((audit) => (
                      <ItemAuditRow
                        key={audit.id}
                        audit={audit}
                        onView={handleViewAudit}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center"
                      >
                        <div className="text-gray-500">
                          {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                            ? "Tidak ada barang yang sesuai dengan filter"
                            : "Tidak ada data barang"}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Tampilan Mobile (Kartu) --- */}
            <div className="md:hidden bg-gray-50 p-4 space-y-4">
              {loading ? (
                <div className="p-12 text-center flex items-center justify-center">
                  <FiRefreshCw className="animate-spin mr-2" />
                  <span>Memuat data...</span>
                </div>
              ) : reports.length > 0 ? (
                reports.map((audit) => (
                  <ItemAuditCard
                    key={audit.id}
                    audit={audit}
                    onView={handleViewAudit}
                  />
                ))
              ) : (
                <div className="p-12 text-center text-gray-500">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "Tidak ada barang yang sesuai dengan filter"
                    : "Tidak ada data barang"}
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.total)} dari {pagination.total} data
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={!pagination.hasPrev}
                    >
                      Sebelumnya
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <Button
                            variant={page === pageNum ? "default" : "outline"}
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={!pagination.hasNext}
                    >
                      Selanjutnya
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
