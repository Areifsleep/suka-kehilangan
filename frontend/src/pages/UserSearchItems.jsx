import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEye,
  FiFilter,
  FiStar,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// Expanded dummy data untuk demo
const allItems = [
  {
    id: 1,
    title: "Dompet Coklat",
    description:
      "Barang bertuktik ditemukan diskeitiak Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam deket Masjid UIN untuk melakukan verifikasi.",
    status: "Ditemukan",
    location: "Masjid UIN",
    date: "25 September 2025",
    reporter: "Petugas Satpam",
    category: "Dompet",
    featured: true,
  },
  {
    id: 2,
    title: "Tas Hitam Eiger",
    description:
      "Tas ransel warna hitam merek Eiger ditemukan di area parkir. Berisi buku dan alat tulis.",
    status: "Ditemukan",
    location: "Area Parkir",
    date: "24 September 2025",
    reporter: "Petugas Parkir",
    category: "Tas",
    featured: false,
  },
  {
    id: 3,
    title: "Kunci Motor Honda",
    description:
      "Gantungan kunci motor dengan gantungan karakter anime ditemukan di dekat kantin.",
    status: "Dicari",
    location: "Kantin",
    date: "23 September 2025",
    reporter: "Mahasiswa",
    category: "Kunci",
    featured: false,
  },
  {
    id: 4,
    title: "iPhone 13 Pro",
    description:
      "Handphone iPhone 13 Pro warna biru dengan case bening. Ditemukan di perpustakaan lantai 2.",
    status: "Ditemukan",
    location: "Perpustakaan",
    date: "22 September 2025",
    reporter: "Petugas Perpustakaan",
    category: "Handphone",
    featured: true,
  },
  {
    id: 5,
    title: "Jaket Kulit Hitam",
    description:
      "Jaket kulit hitam merek Zara ukuran M. Hilang saat kuliah di ruang A.201.",
    status: "Dicari",
    location: "Ruang Kuliah",
    date: "21 September 2025",
    reporter: "Mahasiswa",
    category: "Jaket",
    featured: false,
  },
  {
    id: 6,
    title: "Kacamata Minus",
    description:
      "Kacamata minus dengan frame kotak warna hitam. Lensa agak tebal.",
    status: "Ditemukan",
    location: "Laboratorium",
    date: "20 September 2025",
    reporter: "Asisten Lab",
    category: "Kacamata",
    featured: false,
  },
];

const categories = [
  "Semua Kategori",
  "Dompet",
  "Tas",
  "Kunci",
  "Handphone",
  "Laptop",
  "Buku",
  "Jaket",
  "Kacamata",
  "Lainnya",
];

const locations = [
  "Semua Lokasi",
  "Masjid UIN",
  "Area Parkir",
  "Kantin",
  "Perpustakaan",
  "Ruang Kuliah",
  "Laboratorium",
  "Taman",
  "Lainnya",
];

// ItemCard component dengan design yang lebih baik
function SearchItemCard({ item, onViewDetail }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ditemukan":
        return "bg-green-100 text-green-800 border-green-200";
      case "dicari":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "diserahkan":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 group relative">
      {item.featured && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <FiStar className="w-3 h-3" />
            Terpopuler
          </span>
        </div>
      )}

      <CardContent className="p-0">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-60">
              <FiEye className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          {/* Status badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>

          {/* Meta information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiCalendar className="w-3 h-3" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiMapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FiUser className="w-3 h-3" />
              <span>{item.reporter}</span>
            </div>
          </div>

          {/* Action button */}
          <Button
            onClick={() => onViewDetail(item)}
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
            size="sm"
          >
            <FiEye className="w-4 h-4 mr-2" />
            Lihat Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Advanced Search Filters
function AdvancedFilters({ filters, onFilterChange, onReset }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lokasi
            </label>
            <Select
              value={filters.location}
              onValueChange={(value) => onFilterChange("location", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua</SelectItem>
                <SelectItem value="Ditemukan">Ditemukan</SelectItem>
                <SelectItem value="Dicari">Dicari</SelectItem>
                <SelectItem value="Diserahkan">Diserahkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Dari
            </label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange("dateFrom", e.target.value)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Sampai
            </label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange("dateTo", e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reset Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserSearchItems() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({
    category: "Semua Kategori",
    location: "Semua Lokasi",
    status: "Semua",
    dateFrom: "",
    dateTo: "",
  });
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [sortBy, setSortBy] = useState("newest");

  // Apply filters and search
  useEffect(() => {
    let filtered = allItems;

    // Text search
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== "Semua Kategori") {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    // Location filter
    if (filters.location !== "Semua Lokasi") {
      filtered = filtered.filter((item) => item.location === filters.location);
    }

    // Status filter
    if (filters.status !== "Semua") {
      filtered = filtered.filter((item) => item.status === filters.status);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const fromDate = new Date(filters.dateFrom);
        return itemDate >= fromDate;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        const toDate = new Date(filters.dateTo);
        return itemDate <= toDate;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "featured":
          return b.featured - a.featured;
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [searchTerm, filters, sortBy]);

  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ q: searchTerm });
    } else {
      setSearchParams({});
    }
  }, [searchTerm, setSearchParams]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: "Semua Kategori",
      location: "Semua Lokasi",
      status: "Semua",
      dateFrom: "",
      dateTo: "",
    });
    setSearchTerm("");
  };

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard
        title="Cari Barang Hilang"
        subtitle="Temukan barang yang Anda cari dengan pencarian dan filter lanjutan"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama barang, lokasi, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 text-base h-12 border-gray-300 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredItems.length} Hasil Ditemukan
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {searchTerm && `Pencarian untuk "${searchTerm}"`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Urutkan:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="oldest">Terlama</SelectItem>
                <SelectItem value="featured">Terpopuler</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <SearchItemCard
                key={item.id}
                item={item}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak Ada Hasil Ditemukan
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Coba ubah kata kunci pencarian atau sesuaikan filter Anda.
            </p>
            <Button
              onClick={resetFilters}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
