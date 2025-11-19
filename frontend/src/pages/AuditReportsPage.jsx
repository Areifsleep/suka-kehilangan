import { useState, useEffect } from "react";
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
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/common";

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

function ItemAuditRow({ audit, onView }) {
  const statusConfig = {
    found: {
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-500",
    },
    lost: {
      color: "bg-red-100 text-red-800 border-red-200",
      dot: "bg-red-500",
    },
    claimed: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      dot: "bg-blue-500",
    },
    returned: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      dot: "bg-purple-500",
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
    },
  };

  const config = statusConfig[audit.status] || statusConfig["pending"];

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
          <FiCalendar className="mr-2 text-gray-400" />
          <span>{formatDate(audit.created_at)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {audit.image_url ? (
            <img
              src={audit.image_url}
              alt={audit.item_name}
              className="w-12 h-12 rounded-lg object-cover mr-3 border"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 border">
              <FiPackage className="text-gray-400" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{audit.item_name}</div>
            <div className="text-sm text-gray-500">{audit.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
          {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <FiUser className="text-gray-600 text-sm" />
          </div>
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

export default function AuditReportsPage() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    criticalEvents: 0,
    activeUsers: 0,
  });
  const [itemStats, setItemStats] = useState({
    totalItems: 0,
    foundItems: 0,
    lostItems: 0,
    claimedItems: 0,
  });
  const [audits, setAudits] = useState([]);
  const [itemAudits, setItemAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [filteredItemAudits, setFilteredItemAudits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterResource, setFilterResource] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulating API call - replace with actual API endpoint
    setLoading(true);

    setTimeout(() => {
      // Dummy data for system audit logs
      setStats({
        totalLogs: 1250,
        todayLogs: 89,
        criticalEvents: 3,
        activeUsers: 45,
      });

      // Dummy data for item audit logs
      setItemStats({
        totalItems: 150,
        foundItems: 85,
        lostItems: 42,
        claimedItems: 23,
      });

      // Dummy data for item audits
      setItemAudits([
        {
          id: 1,
          created_at: "2025-09-30T14:30:00Z",
          item_name: "Dompet Coklat",
          category: "Dokumen & Dompet",
          status: "found",
          reporter_name: "Jane Smith",
          reporter_role: "Petugas",
          location: "Gedung A Lantai 2",
          description: "Dompet coklat dengan berbagai kartu di dalamnya",
          image_url: "https://placehold.co/400",
        },
        {
          id: 2,
          created_at: "2025-09-30T14:25:00Z",
          item_name: "Kunci Motor Honda",
          category: "Kendaraan",
          status: "claimed",
          reporter_name: "Bob Wilson",
          reporter_role: "User",
          location: "Parkiran Motor",
          description: "Kunci motor Honda dengan gantungan biru",
          image_url: "https://placehold.co/400",
        },
        {
          id: 3,
          created_at: "2025-09-30T14:20:00Z",
          item_name: "Tas Ransel Hitam",
          category: "Tas & Aksesoris",
          status: "lost",
          reporter_name: "Alice Brown",
          reporter_role: "User",
          location: "Perpustakaan",
          description: "Tas ransel hitam merk Eiger dengan laptop di dalamnya",
          image_url: "https://placehold.co/400",
        },
        {
          id: 4,
          created_at: "2025-09-30T14:15:00Z",
          item_name: "Handphone Samsung",
          category: "Elektronik",
          status: "returned",
          reporter_name: "Charlie Davis",
          reporter_role: "Petugas",
          location: "Kantin",
          description: "Handphone Samsung Galaxy dengan case biru",
          image_url: "https://placehold.co/400",
        },
        {
          id: 5,
          created_at: "2025-09-30T14:10:00Z",
          item_name: "Buku Catatan",
          category: "Alat Tulis",
          status: "found",
          reporter_name: "Eva Martinez",
          reporter_role: "User",
          location: "Ruang Kelas 101",
          description: "Buku catatan dengan cover merah, berisi catatan kuliah",
          image_url: "https://placehold.co/400",
        },
        {
          id: 6,
          created_at: "2025-09-30T14:05:00Z",
          item_name: "Kacamata Minus",
          category: "Aksesoris",
          status: "pending",
          reporter_name: "David Kim",
          reporter_role: "User",
          location: "Lab Komputer",
          description: "Kacamata minus dengan frame hitam",
          image_url: "https://placehold.co/400",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter system audits based on search and filters
  useEffect(() => {
    let filtered = audits;

    if (searchTerm) {
      filtered = filtered.filter(
        (audit) =>
          audit.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.action_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== "all") {
      filtered = filtered.filter((audit) => audit.action_type === filterAction);
    }

    if (filterResource !== "all") {
      filtered = filtered.filter((audit) => audit.resource_type === filterResource);
    }

    // Simple date filtering - in real app, you'd implement proper date range filtering
    if (dateRange === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter((audit) => new Date(audit.timestamp).toDateString() === today);
    }

    setFilteredAudits(filtered);
  }, [audits, searchTerm, filterAction, filterResource, dateRange]);

  // Filter item audits based on search and filters
  useEffect(() => {
    let filtered = itemAudits;

    if (searchTerm) {
      filtered = filtered.filter(
        (audit) =>
          audit.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          audit.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((audit) => audit.status === filterStatus);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((audit) => audit.category === filterCategory);
    }

    // Simple date filtering - in real app, you'd implement proper date range filtering
    if (dateRange === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter((audit) => new Date(audit.created_at).toDateString() === today);
    }

    setFilteredItemAudits(filtered);
  }, [itemAudits, searchTerm, filterStatus, filterCategory, dateRange]);

  const handleViewAudit = (audit) => {
    console.log("View audit detail:", audit);
    // Implement view audit detail functionality
    // You can open a modal with full audit details
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    console.log("Export audit logs");
    // Implement export functionality
  };

  const statusTypes = ["all", "found", "lost", "claimed", "returned", "pending"];
  const categoryTypes = ["all", "Dokumen & Dompet", "Kendaraan", "Tas & Aksesoris", "Elektronik", "Alat Tulis", "Aksesoris"];
  const dateRanges = [
    { value: "today", label: "Hari Ini" },
    { value: "week", label: "Minggu Ini" },
    { value: "month", label: "Bulan Ini" },
    { value: "all", label: "Semua" },
  ];

  return (
    <>
      <HeaderDashboard title="Laporan Audit" />

      <div className="mb-12">
        {/* Stat cards sudah responsif */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Barang"
            value={itemStats.totalItems}
            icon={<FiPackage />}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            trend="up"
            trendValue="+8 barang baru"
          />
          <StatCard
            title="Barang Ditemukan"
            value={itemStats.foundItems}
            icon={<FiCheckCircle />}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            trend="up"
            trendValue="+5 hari ini"
          />
          <StatCard
            title="Barang Hilang"
            value={itemStats.lostItems}
            icon={<FiAlertTriangle />}
            bgColor="bg-red-100"
            iconColor="text-red-600"
            trend="down"
            trendValue="-2 dari kemarin"
          />
          <StatCard
            title="Telah Diambil"
            value={itemStats.claimedItems}
            icon={<FiTrendingUp />}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            trend="up"
            trendValue="+3 hari ini"
          />
        </div>

        <Card className="shadow-sm border-0">
          <CardContent className="p-0">
            {/* Header dengan Search dan Filters - Dibuat responsif */}
            <div className="p-4 sm:p-6 border-b bg-gray-50/50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">Log Laporan Barang</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{filteredItemAudits.length} log</span>
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <FiDownload className="text-sm" />
                    <span className="hidden sm:inline">Export</span>
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
                        key={status}
                        value={status}
                      >
                        {status === "all" ? "Semua Status" : status.charAt(0).toUpperCase() + status.slice(1)}
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
                        key={category}
                        value={category}
                      >
                        {category === "all" ? "Semua Kategori" : category}
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
                  ) : filteredItemAudits.length > 0 ? (
                    filteredItemAudits.map((audit) => (
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
              ) : filteredItemAudits.length > 0 ? (
                filteredItemAudits.map((audit) => (
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
