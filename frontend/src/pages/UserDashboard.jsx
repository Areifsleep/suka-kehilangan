import { useState, useEffect } from "react";
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiEye, FiClock, FiPackage } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { HeaderDashboard } from "@/components/common";

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
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
          </div>
          {item.image && (
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 ml-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02IDZIMTRWMTRINlY2WiIgc3Ryb2tlPSIjOUIxMjU5IiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIvPgo8L3N2Zz4K";
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600">
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

        <div className="mt-4 pt-4 border-t">
          <p className="text-gray-700 text-sm line-clamp-2 mb-3">{item.description}</p>
          <button
            onClick={() => onViewDetail(item)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <FiEye />
            Lihat Detail
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// StatCard component untuk statistik
function StatCard({ title, value, icon, bgColor, iconColor }) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          </div>
          <div className={`p-3 rounded-full ${bgColor}`}>{React.createElement(icon, { className: `text-xl ${iconColor}` })}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UserDashboard() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Dummy data untuk demonstrasi
  useEffect(() => {
    const dummyItems = [
      {
        id: 1,
        title: "Dompet Coklat",
        status: "Ditemukan",
        location: "Sekitar Masjid UIN",
        foundDate: "25 September 2025",
        officer: "Ahmad Rizki",
        description:
          "Barang berikut ditemukan disekitar Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam dekat Masjid UIN untuk melakukan verifikasi.",
        image: null,
        contact: "Pos Satpam Masjid UIN",
      },
      {
        id: 2,
        title: "Kunci Motor Honda",
        status: "Dicari",
        location: "Parkiran Fakultas Teknik",
        foundDate: "24 September 2025",
        officer: "Siti Aminah",
        description: "Kunci motor Honda dengan gantungan bertuliskan nama 'Budi'. Ditemukan di area parkiran Fakultas Teknik.",
        image: null,
        contact: "Security Fakultas Teknik",
      },
      {
        id: 3,
        title: "Tas Ransel Hitam",
        status: "Diserahkan",
        location: "Perpustakaan Pusat",
        foundDate: "23 September 2025",
        officer: "Muhammad Fauzan",
        description: "Tas ransel hitam berisi buku-buku kuliah dan alat tulis. Sudah diserahkan kepada pemilik yang sah.",
        image: null,
        contact: "Perpustakaan Pusat",
      },
      {
        id: 4,
        title: "Handphone Samsung",
        status: "Ditemukan",
        location: "Kantin Pusat",
        foundDate: "22 September 2025",
        officer: "Nur Hidayah",
        description: "Handphone Samsung warna biru muda dengan case bergambar kartun. Ditemukan di meja kantin pusat.",
        image: null,
        contact: "Kantin Pusat",
      },
      {
        id: 5,
        title: "Jaket Merah",
        status: "Ditemukan",
        location: "Auditorium Utama",
        foundDate: "21 September 2025",
        officer: "Abdul Rahman",
        description: "Jaket merah ukuran L dengan logo universitas. Tertinggal di auditorium setelah acara seminar.",
        image: null,
        contact: "Bagian Kemahasiswaan",
      },
    ];

    setTimeout(() => {
      setItems(dummyItems);
      setFilteredItems(dummyItems);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items berdasarkan pencarian
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleViewDetail = (item) => {
    alert(`Detail untuk ${item.title}:\n\n${item.description}\n\nKontak: ${item.contact}`);
  };

  // Statistik
  const stats = {
    total: items.length,
    found: items.filter((item) => item.status === "Ditemukan").length,
    returned: items.filter((item) => item.status === "Diserahkan").length,
    searching: items.filter((item) => item.status === "Dicari").length,
  };

  return (
    <div className="space-y-6">
      <HeaderDashboard
        title="Daftar Barang Hilang"
        subtitle="Temukan barang yang hilang atau laporkan barang yang ditemukan"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Barang"
          value={stats.total}
          icon={FiPackage}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Ditemukan"
          value={stats.found}
          icon={FiEye}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Diserahkan"
          value={stats.returned}
          icon={FiUser}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Dicari"
          value={stats.searching}
          icon={FiClock}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama barang, lokasi, atau deskripsi..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onViewDetail={handleViewDetail}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FiSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada barang ditemukan</h3>
            <p className="text-gray-500">
              {searchTerm ? `Tidak ada hasil untuk "${searchTerm}". Coba dengan kata kunci lain.` : "Belum ada barang hilang yang terdaftar."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-medium text-green-800 mb-2">Menemukan barang yang hilang?</h3>
            <p className="text-green-700 text-sm mb-4">Segera laporkan ke petugas terdekat atau melalui aplikasi ini untuk membantu pemiliknya.</p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
              Laporkan Temuan
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
