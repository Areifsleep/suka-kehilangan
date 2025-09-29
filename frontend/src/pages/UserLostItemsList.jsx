import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiEye, FiFilter } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// Dummy data untuk demo - sesuai dengan context gambar
const dummyItems = [
  {
    id: 1,
    title: "Dompet Coklat",
    description:
      "Barang bertuktik ditemukan diskeitiak Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam deket Masjid UIN untuk melakukan verifikasi.",
    status: "Ditemukan",
    location: "Masjid UIN",
    date: "25 September 2025",
    reporter: "Petugas Satpam",
    image: "/api/placeholder/300/200",
    category: "Dompet",
  },
  {
    id: 2,
    title: "Tas Hitam",
    description: "Tas ransel warna hitam merek Eiger ditemukan di area parkir. Berisi buku dan alat tulis.",
    status: "Ditemukan",
    location: "Area Parkir",
    date: "24 September 2025",
    reporter: "Petugas Parkir",
    image: "/api/placeholder/300/200",
    category: "Tas",
  },
  {
    id: 3,
    title: "Kunci Motor",
    description: "Gantungan kunci motor dengan gantungan karakter anime ditemukan di dekat kantin.",
    status: "Dicari",
    location: "Kantin",
    date: "23 September 2025",
    reporter: "Mahasiswa",
    image: "/api/placeholder/300/200",
    category: "Kunci",
  },
];

// ItemCard component untuk menampilkan setiap item barang hilang
function ItemCard({ item, onViewDetail }) {
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
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm group bg-white overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image placeholder */}
          <div className="w-full md:w-48 h-32 md:h-auto bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-blue-500/10 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                <FiEye className="w-6 h-6 text-green-600" />
              </div>
            </div>
            {/* Status badge */}
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{item.title}</h3>
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mb-2">
                  {item.category}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{item.description}</p>

            {/* Meta information - horizontal layout */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4 text-green-600" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="w-4 h-4 text-blue-600" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-purple-600" />
                <span>{item.reporter}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-end">
              <Button
                onClick={() => onViewDetail(item)}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                size="sm"
              >
                <FiEye className="w-4 h-4 mr-2" />
                Lihat Detail
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// FilterBar component
function FilterBar({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) {
  const filters = [
    { value: "all", label: "Semua", color: "gray" },
    { value: "ditemukan", label: "Ditemukan", color: "green" },
    { value: "dicari", label: "Dicari", color: "yellow" },
    { value: "diserahkan", label: "Diserahkan", color: "blue" },
  ];

  const getFilterStyles = (filter, isSelected) => {
    if (isSelected) {
      switch (filter.color) {
        case "green":
          return "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg";
        case "yellow":
          return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg";
        case "blue":
          return "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg";
        default:
          return "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg";
      }
    }
    return "border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50 bg-white";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border-0 p-6 mb-8 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <FiSearch className="w-5 h-5" />
          </div>
          <Input
            type="text"
            placeholder="Cari barang hilang berdasarkan nama, lokasi, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-base bg-gray-50 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 flex-wrap">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant="outline"
              size="lg"
              onClick={() => setSelectedFilter(filter.value)}
              className={`transition-all duration-200 hover:scale-105 ${getFilterStyles(filter, selectedFilter === filter.value)}`}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main component
export default function UserLostItemsList() {
  const navigate = useNavigate();
  const [items, setItems] = useState(dummyItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [filteredItems, setFilteredItems] = useState(dummyItems);

  // Filter items based on search term and selected filter
  useEffect(() => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedFilter !== "all") {
      filtered = filtered.filter((item) => item.status.toLowerCase() === selectedFilter.toLowerCase());
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedFilter]);

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  return (
    <div className="min-h-screen">
      <HeaderDashboard
        title="Daftar Barang Hilang"
        subtitle="Temukan atau laporkan barang yang hilang di lingkungan kampus"
      />

      <div>
        {/* Filter bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Results header */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiSearch className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{filteredItems.length} Barang Ditemukan</h2>
                <p className="text-sm text-gray-600">
                  {searchTerm && `Hasil pencarian: "${searchTerm}"`}
                  {selectedFilter !== "all" && ` • Status: ${selectedFilter}`}
                  {!searchTerm && selectedFilter === "all" && "Menampilkan semua barang"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items list */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ItemCard
                  item={item}
                  onViewDetail={handleViewDetail}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Barang Ditemukan</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Tidak ada barang yang cocok dengan kriteria pencarian Anda. Coba ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
