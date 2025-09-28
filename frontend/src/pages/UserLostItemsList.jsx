import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEye,
  FiFilter,
} from "react-icons/fi";
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
    description:
      "Tas ransel warna hitam merek Eiger ditemukan di area parkir. Berisi buku dan alat tulis.",
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
    description:
      "Gantungan kunci motor dengan gantungan karakter anime ditemukan di dekat kantin.",
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
    <Card className="hover:shadow-lg transition-all duration-300 border border-gray-200 group">
      <CardContent className="p-0">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-gray-200 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-50">
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
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {item.description}
            </p>
          </div>

          {/* Meta information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiCalendar className="w-4 h-4" />
              <span>Dilaporkan: {item.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiMapPin className="w-4 h-4" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiUser className="w-4 h-4" />
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

// FilterBar component
function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
}) {
  const filters = [
    { value: "all", label: "Semua" },
    { value: "ditemukan", label: "Ditemukan" },
    { value: "dicari", label: "Dicari" },
    { value: "diserahkan", label: "Diserahkan" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Cari barang hilang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter.value)}
              className={`${
                selectedFilter === filter.value
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300"
              }`}
            >
              <FiFilter className="w-4 h-4 mr-1" />
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
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedFilter]);

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard
        title="Daftar Barang Hilang"
        subtitle="Temukan atau laporkan barang yang hilang di lingkungan kampus"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Results header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredItems.length} Barang Ditemukan
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {searchTerm &&
                  `Menampilkan hasil pencarian untuk "${searchTerm}"`}
                {selectedFilter !== "all" &&
                  ` dengan status "${selectedFilter}"`}
              </p>
            </div>
          </div>
        </div>

        {/* Items grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
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
              Tidak Ada Barang Ditemukan
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Tidak ada barang yang cocok dengan kriteria pencarian Anda. Coba
              ubah kata kunci atau filter yang digunakan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
