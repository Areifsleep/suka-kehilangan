import { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiEye,
  FiFilter,
  FiImage,
  FiLoader,
  FiChevronLeft,
  FiChevronRight,
  FiAlertCircle,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBarangTemuanList, useCategories } from "../queries/useBarangTemuan";
import { useDebounce } from "@/hooks/useDebounce";

const dummyItems = [
  {
    id: "abc123",
    item_name: "Dompet Coklat",
    description:
      "Barang ditemukan di sekitar Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam dekat Masjid UIN untuk melakukan verifikasi.",
    report_status: "BELUM_DIAMBIL",
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
    report_images: [
      {
        url: "https://media.istockphoto.com/id/180756294/id/foto/dompet.jpg?s=612x612&w=0&k=20&c=C_C9g30YcZv5qYbTIGyJsWUVVxdriFBdIb2nfCPoI98=",
      },
    ],
  },
  {
    id: "def456",
    item_name: "Tas Hitam",
    description:
      "Tas ransel warna hitam merek Eiger ditemukan di area parkir. Berisi buku dan alat tulis.",
    report_status: "BELUM_DIAMBIL",
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
    report_images: [
      {
        url: "https://down-id.img.susercontent.com/file/0ecb35771cd44cb77aad7e57b5772a92",
      },
    ],
  },
  {
    id: "ghi789",
    item_name: "Kunci Motor",
    description:
      "Gantungan kunci motor dengan gantungan karakter anime hilang di dekat kantin. Mohon bantuan untuk menemukannya.",
    report_status: "SUDAH_DIAMBIL",
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
    report_images: [
      {
        url: "https://moladin.com/wp-content/uploads/2020/03/Kunci-Motor-Hilang-Simak-5-Hal-yang-Mesti-Dilakukan.-saibumi.jpg",
      },
    ],
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

  // Map backend response to frontend format
  const mappedItem = {
    id: item.id,
    item_name: item.nama_barang,
    description: item.deskripsi,
    report_status: item.status,
    place_found: item.lokasi_ditemukan,
    created_at: item.created_at,
    created_by: item.pencatat,
    category: {
      name: item.kategori?.nama || "Tidak ada kategori",
    },
    report_images: item.foto_barang || [],
  };

  return (
    <Card className="border border-gray-200 shadow-sm group bg-white overflow-hidden rounded-lg">
      <CardContent className="p-0">
        <div className="flex flex-col">
          {/* Image Cover */}
          <div className="relative w-full h-96 overflow-hidden">
            {mappedItem.report_images.length !== 0 ? (
              <img
                src={mappedItem.report_images[0].url_gambar}
                alt={mappedItem.item_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <FiImage className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">
                    Tidak ada foto
                  </p>
                </div>
              </div>
            )}

            {/* Badge overlay on image */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1.5 rounded-md text-xs font-bold shadow-lg bg-green-300`}
              >
                Ditemukan
              </span>
            </div>
          </div>

          {/* Header with badges */}
          <div className="p-5 pb-4 border-b border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors leading-tight">
                  {mappedItem.item_name}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-700 border border-gray-200">
                  {mappedItem.category.name}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
              {mappedItem.description}
            </p>

            {/* Meta information grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-blue-600 font-medium mb-0.5">
                    Tanggal
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {formatDate(mappedItem.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-purple-600 font-medium mb-0.5">
                    Lokasi
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {mappedItem.place_found}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-orange-600 font-medium mb-0.5">
                    Diunggah oleh
                  </p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {mappedItem.created_by?.profile?.full_name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <Button
              onClick={() => onViewDetail(mappedItem)}
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
function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  isLoadingCategories,
}) {
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
            placeholder="Cari barang berdasarkan nama, lokasi, atau deskripsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-14 pr-5 py-3 h-12 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-base bg-white transition-all duration-200 hover:border-gray-400 shadow-sm"
          />
        </div>

        {/* Category filter dropdown */}
        <div className="lg:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isLoadingCategories}
            className="w-full h-12 px-4 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-base bg-white transition-all duration-200 hover:border-gray-400 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">Semua Kategori</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nama} ({category._count?.barang_temuan || 0})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Menampilkan hasil pencarian untuk:{" "}
            <span className="font-semibold text-gray-900">"{searchTerm}"</span>
          </p>
        </div>
      )}
    </div>
  );
}

// Main component
export default function BerandaUserPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch barang temuan with filters
  const {
    data: barangData,
    isLoading,
    isError,
    error,
  } = useBarangTemuanList({
    search: debouncedSearchTerm,
    kategori_id: selectedCategory,
    page,
    limit,
  });

  // Fetch categories for filter dropdown
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat data barang temuan...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <FiAlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Gagal Memuat Data
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message ||
              "Terjadi kesalahan saat memuat data barang temuan."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  const items = barangData?.data || [];
  const totalPages = barangData?.meta?.totalPages || 1;
  const totalItems = barangData?.meta?.total || 0;

  return (
    <div className="min-h-screen">
      <div>
        {/* Filter bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />

        {/* Items list */}
        {items.length > 0 ? (
          <div>
            {/* Results info */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan{" "}
                <span className="font-semibold">{items.length}</span> dari{" "}
                <span className="font-semibold">{totalItems}</span> barang
              </p>
              <p className="text-sm text-gray-600">
                Halaman {page} dari {totalPages}
              </p>
            </div>

            {/* Items grid */}
            <div className="space-y-5">
              {items.map((item) => (
                <div key={item.id}>
                  <ItemCard item={item} onViewDetail={handleViewDetail} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  className="px-4"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  Sebelumnya
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={page === pageNum ? "default" : "outline"}
                        className={
                          page === pageNum
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  variant="outline"
                  className="px-4"
                >
                  Selanjutnya
                  <FiChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Tidak Ada Barang Ditemukan
            </h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
              Tidak ada barang yang cocok dengan kriteria pencarian Anda. Coba
              ubah kata kunci atau filter yang digunakan.
            </p>
            {(searchTerm || selectedCategory) && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setPage(1);
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
