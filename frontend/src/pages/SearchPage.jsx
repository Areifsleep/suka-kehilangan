import React, { useState } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiEye, FiFilter, FiRefreshCw } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/common/HeaderDashboard";

// FilterSection component
function FilterSection({ filters, onFilterChange, onReset }) {
  const statusOptions = ["Semua", "Ditemukan", "Dicari", "Diserahkan"];
  const locationOptions = ["Semua Lokasi", "Masjid UIN", "Fakultas Teknik", "Perpustakaan", "Kantin", "Auditorium"];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiFilter className="text-green-600" />
          <h3 className="font-medium text-gray-900">Filter Pencarian</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange("status", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {statusOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
            <select
              value={filters.location}
              onChange={(e) => onFilterChange("location", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {locationOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange("dateFrom", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange("dateTo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiRefreshCw className="text-sm" />
            Reset Filter
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// SearchResultCard component
function SearchResultCard({ item, onViewDetail }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ditemukan":
        return "bg-green-100 text-green-800";
      case "dicari":
        return "bg-yellow-100 text-yellow-800";
      case "diserahkan":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-red-500" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="text-blue-500" />
            <span>Ditemukan: {item.foundDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="text-purple-500" />
            <span>Petugas: {item.officer}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{item.description}</p>

        <button
          onClick={() => onViewDetail(item)}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <FiEye />
          Lihat Detail
        </button>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "Semua",
    location: "Semua Lokasi",
    dateFrom: "",
    dateTo: "",
  });
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy data
  const allItems = [
    {
      id: 1,
      title: "Dompet Coklat",
      status: "Ditemukan",
      location: "Sekitar Masjid UIN",
      foundDate: "2025-09-25",
      officer: "Ahmad Rizki",
      description:
        "Barang berikut ditemukan disekitar Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam dekat Masjid UIN untuk melakukan verifikasi.",
      contact: "Pos Satpam Masjid UIN",
    },
    {
      id: 2,
      title: "Kunci Motor Honda",
      status: "Dicari",
      location: "Parkiran Fakultas Teknik",
      foundDate: "2025-09-24",
      officer: "Siti Aminah",
      description: "Kunci motor Honda dengan gantungan bertuliskan nama 'Budi'. Ditemukan di area parkiran Fakultas Teknik.",
      contact: "Security Fakultas Teknik",
    },
    {
      id: 3,
      title: "Tas Ransel Hitam",
      status: "Diserahkan",
      location: "Perpustakaan Pusat",
      foundDate: "2025-09-23",
      officer: "Muhammad Fauzan",
      description: "Tas ransel hitam berisi buku-buku kuliah dan alat tulis. Sudah diserahkan kepada pemilik yang sah.",
      contact: "Perpustakaan Pusat",
    },
    {
      id: 4,
      title: "Handphone Samsung",
      status: "Ditemukan",
      location: "Kantin Pusat",
      foundDate: "2025-09-22",
      officer: "Nur Hidayah",
      description: "Handphone Samsung warna biru muda dengan case bergambar kartun. Ditemukan di meja kantin pusat.",
      contact: "Kantin Pusat",
    },
    {
      id: 5,
      title: "Jaket Merah",
      status: "Ditemukan",
      location: "Auditorium Utama",
      foundDate: "2025-09-21",
      officer: "Abdul Rahman",
      description: "Jaket merah ukuran L dengan logo universitas. Tertinggal di auditorium setelah acara seminar.",
      contact: "Bagian Kemahasiswaan",
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "Semua",
      location: "Semua Lokasi",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

  const handleSearch = () => {
    setLoading(true);

    setTimeout(() => {
      let filtered = [...allItems];

      // Filter by search term
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (filters.status !== "Semua") {
        filtered = filtered.filter((item) => item.status === filters.status);
      }

      // Filter by location
      if (filters.location !== "Semua Lokasi") {
        filtered = filtered.filter((item) => item.location.toLowerCase().includes(filters.location.toLowerCase().replace(/\s+/g, " ").trim()));
      }

      // Filter by date range
      if (filters.dateFrom) {
        filtered = filtered.filter((item) => item.foundDate >= filters.dateFrom);
      }
      if (filters.dateTo) {
        filtered = filtered.filter((item) => item.foundDate <= filters.dateTo);
      }

      setFilteredItems(filtered);
      setLoading(false);
    }, 800);
  };

  const handleViewDetail = (item) => {
    alert(`Detail untuk ${item.title}:\n\n${item.description}\n\nKontak: ${item.contact}`);
  };

  return (
    <div className="space-y-6">
      <HeaderDashboard
        title="Cari Barang Hilang"
        subtitle="Gunakan pencarian dan filter untuk menemukan barang yang hilang"
      />

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama barang, lokasi, atau deskripsi..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
            >
              <FiSearch />
              Cari
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* Search Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="animate-pulse"
            >
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Ditemukan {filteredItems.length} hasil
              {searchTerm && ` untuk "${searchTerm}"`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <SearchResultCard
                key={item.id}
                item={item}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada hasil ditemukan</h3>
            <p className="text-gray-500 mb-6">Coba ubah kata kunci pencarian atau filter yang digunakan.</p>
            <button
              onClick={resetFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Reset Pencarian
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
