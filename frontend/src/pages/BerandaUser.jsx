import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiEye, FiFilter, FiTag } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Dummy data sesuai dengan schema database
const dummyItems = [
  {
    id: "abc123",
    item_name: "Dompet Coklat",
    description:
      "Barang ditemukan di sekitar Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam dekat Masjid UIN untuk melakukan verifikasi.",
    report_type: "FOUND", // FOUND atau LOST
    report_status: "OPEN", // OPEN, CLAIMED, atau CLOSED
    place_found: "Masjid UIN",
    created_at: "2025-09-25T10:30:00Z",
    created_by: {
      profile: {
        full_name: "Ahmad Petugas",
      },
    },
    category: {
      name: "Dompet",
    },
    report_images: [],
  },
  {
    id: "def456",
    item_name: "Tas Hitam",
    description: "Tas ransel warna hitam merek Eiger ditemukan di area parkir. Berisi buku dan alat tulis.",
    report_type: "FOUND",
    report_status: "OPEN",
    place_found: "Area Parkir",
    created_at: "2025-09-24T14:15:00Z",
    created_by: {
      profile: {
        full_name: "Budi Satpam",
      },
    },
    category: {
      name: "Tas",
    },
    report_images: [],
  },
  {
    id: "ghi789",
    item_name: "Kunci Motor",
    description: "Gantungan kunci motor dengan gantungan karakter anime hilang di dekat kantin. Mohon bantuan untuk menemukannya.",
    report_type: "LOST",
    report_status: "OPEN",
    place_found: "Kantin",
    created_at: "2025-09-23T09:00:00Z",
    created_by: {
      profile: {
        full_name: "Siti Mahasiswa",
      },
    },
    category: {
      name: "Kunci",
    },
    report_images: [],
  },
];

function ItemCard({ item, onViewDetail }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReportTypeLabel = (type) => {
    return type === "FOUND" ? "Ditemukan" : "Dicari";
  };

  const getReportTypeColor = (type) => {
    return type === "FOUND" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "CLAIMED":
        return "bg-orange-100 text-orange-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Terbuka";
      case "CLAIMED":
        return "Diklaim";
      case "CLOSED":
        return "Selesai";
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border border-gray-200 shadow-sm group bg-white overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Header with badges */}
          <div className="p-5 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">{item.item_name}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-700 border border-gray-200">
                  <FiTag className="w-3.5 h-3.5" />
                  {item.category.name}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end ml-4">
                <span className={`px-3 py-1.5 rounded-md text-xs font-bold ${getReportTypeColor(item.report_type)}`}>
                  {getReportTypeLabel(item.report_type)}
                </span>
                <span className={`px-3 py-1.5 rounded-md text-xs font-semibold ${getStatusColor(item.report_status)}`}>
                  {getStatusLabel(item.report_status)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">{item.description}</p>

            {/* Meta information grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">Tanggal</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{formatDate(item.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-purple-600 font-medium mb-0.5">Lokasi</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.place_found}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-orange-600 font-medium mb-0.5">Pelapor</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.created_by.profile.full_name}</p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={() => onViewDetail(item)}
              className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:shadow-lg font-semibold py-6"
              size="lg"
            >
              <FiEye className="w-5 h-5 mr-2" />
              Lihat Detail Barang
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// FilterBar component
function FilterBar({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }) {
  const filters = [
    { value: "all", label: "Semua" },
    { value: "FOUND", label: "Ditemukan" },
    { value: "LOST", label: "Dicari" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
      <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <FiSearch className="w-5 h-5" />
          </div>
          <Input
            type="text"
            placeholder="Cari barang hilang berdasarkan nama, lokasi, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-5 py-4 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-base bg-white transition-all duration-200 hover:border-gray-400 shadow-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex gap-3 flex-wrap lg:flex-nowrap">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={selectedFilter === filter.value ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedFilter(filter.value)}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Menampilkan hasil pencarian untuk: <span className="font-semibold text-gray-900">"{searchTerm}"</span>
          </p>
        </div>
      )}
    </div>
  );
}

// Main component
export default function BerandaUserPage() {
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
          item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.place_found.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by report type
    if (selectedFilter !== "all") {
      filtered = filtered.filter((item) => item.report_type === selectedFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedFilter]);

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  return (
    <div className="min-h-screen">
      <div>
        {/* Filter bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />

        {/* Items list */}
        {filteredItems.length > 0 ? (
          <div>
            {/* Items grid */}
            <div className="space-y-5">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 75}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <ItemCard
                    item={item}
                    onViewDetail={handleViewDetail}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tidak Ada Barang Ditemukan</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Tidak ada barang yang cocok dengan kriteria pencarian Anda. Coba ubah kata kunci atau filter yang digunakan.
            </p>
            {(searchTerm || selectedFilter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                }}
                variant="outline"
                className="mt-6 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold"
              >
                Reset Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
