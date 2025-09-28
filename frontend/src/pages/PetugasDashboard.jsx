import React, { useState, useEffect } from "react";
import {
  FiPackage,
  FiClock,
  FiCheck,
  FiFileText,
  FiEdit2,
  FiSearch,
  FiPlus,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// Enhanced StatCard component with trends and animations
function StatCard({
  title,
  value,
  icon,
  bgColor = "bg-gray-100",
  iconColor = "text-gray-400",
  trend,
  trendValue,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-6 group">
      <div className="flex items-center justify-between">
        <div className="flex flex-col flex-1">
          <div className="text-sm text-gray-500 mb-1">{title}</div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
          {trend && (
            <div
              className={`flex items-center text-sm ${
                trend === "up"
                  ? "text-green-600"
                  : trend === "down"
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              <FiTrendingUp
                className={`mr-1 text-xs ${
                  trend === "down" ? "rotate-180" : ""
                }`}
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}
        >
          <div className={`text-2xl ${iconColor}`}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

function ItemRow({ item, onEdit, onView }) {
  const statusConfig = {
    Tersedia: {
      color: "bg-green-100 text-green-800 border-green-200",
      dot: "bg-green-500",
    },
    Diambil: {
      color: "bg-red-100 text-red-800 border-red-200",
      dot: "bg-red-500",
    },
    Proses: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      dot: "bg-yellow-500",
    },
  };

  const config = statusConfig[item.status] || statusConfig["Tersedia"];

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden group">
          {item.photo ? (
            <img
              src={item.photo}
              alt={item.description}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="text-gray-400 text-xl" />
            </div>
          )}
          {item.isNew && (
            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{item.description}</div>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <FiCalendar className="mr-1 text-xs" />
          <span>{item.foundDate}</span>
        </div>
        {item.reportedBy && (
          <div className="text-xs text-gray-400 mt-1">
            Dilaporkan oleh: {item.reportedBy}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          {item.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <FiMapPin className="mr-1 text-gray-400" />
          <span>{item.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
        >
          <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(item)}
            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors text-blue-600"
            title="Lihat Detail"
          >
            <FiEye className="text-sm" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
            title="Edit"
          >
            <FiEdit2 className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PetugasDashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    unclaimed: 0,
    claimed: 0,
    reports: 0,
  });
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulating API calls - replace with actual API endpoints
    setLoading(true);

    setTimeout(() => {
      // Enhanced dummy data dengan trend
      setStats({
        totalItems: 500,
        unclaimed: 200,
        claimed: 300,
        reports: 20,
      });

      setItems([
        {
          id: 1,
          description: "Dompet Coklat",
          foundDate: "24 September 2025",
          category: "Barang Pribadi",
          location: "Masjid UIN",
          status: "Tersedia",
          photo: null,
          isNew: true,
          reportedBy: "Satpam Ahmad",
        },
        {
          id: 2,
          description: "Handphone Samsung Galaxy",
          foundDate: "25 September 2025",
          category: "Elektronik",
          location: "Tempat Parkir",
          status: "Diambil",
          photo: null,
          isNew: false,
          reportedBy: "Petugas Keamanan",
        },
        {
          id: 3,
          description: "Kunci Motor Honda",
          foundDate: "25 September 2025",
          category: "Kendaraan",
          location: "Tempat Parkir",
          status: "Proses",
          photo: null,
          isNew: false,
          reportedBy: "Mahasiswa",
        },
        {
          id: 4,
          description: "Tas Ransel Hitam",
          foundDate: "26 September 2025",
          category: "Barang Pribadi",
          location: "Perpustakaan",
          status: "Tersedia",
          photo: null,
          isNew: true,
          reportedBy: "Petugas Perpus",
        },
        {
          id: 5,
          description: "Kacamata",
          foundDate: "27 September 2025",
          category: "Aksesori",
          location: "Ruang Kelas A",
          status: "Tersedia",
          photo: null,
          isNew: true,
          reportedBy: "Dosen",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items berdasarkan search dan filter
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, filterStatus, filterCategory]);

  const handleEditItem = (item) => {
    console.log("Edit item:", item);
    // Implement edit functionality
    // You can open a modal or navigate to edit page
  };

  const handleViewItem = (item) => {
    console.log("View item:", item);
    // Implement view functionality
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const categories = [
    "all",
    "Barang Pribadi",
    "Elektronik",
    "Kendaraan",
    "Aksesori",
  ];
  const statuses = ["all", "Tersedia", "Diambil", "Proses"];

  return (
    <>
      <HeaderDashboard title="Dashboard Petugas" />

      {/* Stat cards dengan trend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Barang"
          value={stats.totalItems}
          icon={<FiPackage />}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendValue="+12% dari minggu lalu"
        />
        <StatCard
          title="Belum Diambil"
          value={stats.unclaimed}
          icon={<FiClock />}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
          trend="down"
          trendValue="-5% dari minggu lalu"
        />
        <StatCard
          title="Sudah Diambil"
          value={stats.claimed}
          icon={<FiCheck />}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendValue="+8% dari minggu lalu"
        />
        <StatCard
          title="Laporan Masuk"
          value={stats.reports}
          icon={<FiFileText />}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          trend="up"
          trendValue="+3 hari ini"
        />
      </div>

      {/* Items Table with Enhanced Features */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-0">
          {/* Header dengan Search dan Filter */}
          <div className="p-6 border-b bg-gray-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Daftar Barang Temuan
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {filteredItems.length} item
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`text-sm ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm">Refresh</span>
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <FiPlus className="text-sm" />
                  <span className="text-sm">Tambah Item</span>
                </button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari barang, lokasi, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "Semua Status" : status}
                    </option>
                  ))}
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Semua Kategori" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onEdit={handleEditItem}
                      onView={handleViewItem}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm ||
                        filterStatus !== "all" ||
                        filterCategory !== "all"
                          ? "Tidak ada barang yang sesuai dengan filter"
                          : "Tidak ada barang temuan"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
