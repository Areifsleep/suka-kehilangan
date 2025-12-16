import { useState } from "react";
import { useNavigate } from "react-router";
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiImage, FiLoader, FiChevronLeft, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SafeImage } from "@/components/ui/safe-image";
import { useBarangTemuanList, useCategories } from "../queries/useBarangTemuan";
import { useDebounce } from "@/hooks/useDebounce";
import { getRelativeTime } from "@/utils/format-time";

function ItemCard({ item, onViewDetail }) {
  const mappedItem = {
    id: item.id,
    item_name: item.nama_barang,
    description: item.deskripsi,
    report_status: item.status,
    place_found:
      item.lokasi_umum && item.lokasi_spesifik
        ? `${item.lokasi_umum} - ${item.lokasi_spesifik}`
        : item.lokasi_umum || item.lokasi_spesifik || "Lokasi tidak diketahui",
    created_at: item.created_at,
    created_by: item.pencatat,
    category: {
      name: item.kategori?.nama || "Tidak ada kategori",
    },
    report_images: item.foto_barang || [],
  };

  return (
    <Card
      className="border border-gray-200 shadow-sm hover:shadow-lg group bg-white overflow-hidden rounded-xl transition-all duration-200 cursor-pointer"
      onClick={() => onViewDetail(mappedItem)}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:h-52">
          {/* Image Cover */}
          <div className="relative w-full md:w-80 h-64 md:h-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
            {mappedItem.report_images.length !== 0 ? (
              <SafeImage
                src={mappedItem.report_images[0].url_gambar}
                alt={mappedItem.item_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                fallbackClassName="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <FiImage className="w-14 h-14 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Tidak ada foto</p>
                </div>
              </div>
            )}

            {/* Badge overlay on image */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg bg-green-500 text-white backdrop-blur-sm">Ditemukan</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 md:py-4 md:px-5">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-2.5 group-hover:text-green-600 transition-colors leading-tight line-clamp-2">
                  {mappedItem.item_name}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 text-xs font-semibold text-gray-700 border border-gray-200 truncate max-w-[200px]">
                    {mappedItem.category.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {getRelativeTime(mappedItem.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">{mappedItem.description}</p>

            {/* Meta information */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm min-w-0">
                <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 leading-tight">Lokasi</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{mappedItem.place_found}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm min-w-0">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <FiUser className="w-3.5 h-3.5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500 leading-tight">Diunggah oleh</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{mappedItem.created_by?.profile?.full_name || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, isLoadingCategories }) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 md:p-7 mb-6">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-gray-900">Cari Barang Temuan</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              <FiSearch className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="Ketik nama barang, lokasi, atau deskripsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-10 py-3 h-12 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-sm md:text-base bg-white transition-all duration-200 hover:border-green-400 hover:shadow-md focus:shadow-md font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Category filter dropdown */}
          <div className="lg:w-64 relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isLoadingCategories}
              className="w-full h-12 pl-12 pr-10 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl text-sm md:text-base bg-white transition-all duration-200 hover:border-green-400 hover:shadow-md focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed appearance-none font-medium cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23059669' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              <option value="">Semua Kategori</option>
              {categories?.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.nama} ({category._count?.barang_temuan || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters info */}
        {(searchTerm || selectedCategory) && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter Aktif:</span>
            {searchTerm && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs font-medium text-green-700">
                <FiSearch className="w-3.5 h-3.5" />
                <span className="max-w-[200px] truncate">"{searchTerm}"</span>
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-green-900 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {selectedCategory && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-medium text-purple-700">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="max-w-[150px] truncate">{categories?.find((c) => c.id === selectedCategory)?.nama}</span>
                <button
                  onClick={() => setSelectedCategory("")}
                  className="hover:text-purple-900 transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Reset Semua
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BerandaUserPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: barangData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useBarangTemuanList({
    search: debouncedSearchTerm,
    kategori_id: selectedCategory,
    page,
    limit,
  });

  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const handleViewDetail = (item) => {
    navigate(`/user/item/${item.id}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <FiAlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Gagal Memuat Data</h3>
          <p className="text-gray-600 mb-6">{error?.message || "Terjadi kesalahan saat memuat data barang temuan."}</p>
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

  const HAS_PREVIOUS_PAGE = page > 1;
  const HAS_NEXT_PAGE = page < totalPages;

  const isRefetching = isFetching && !isLoading;

  return (
    <div className="min-h-screen">
      <div>
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
        />

        {/* Initial Loading State - Skeleton */}
        {isLoading ? (
          <div className="space-y-6">
            {/* Skeleton Results Info */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-4 border border-gray-200 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
                  <div>
                    <div className="h-3 w-20 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-40 bg-gray-300 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-300"></div>
                  <div>
                    <div className="h-3 w-16 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Cards */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 shadow-sm bg-white overflow-hidden rounded-xl animate-pulse"
              >
                <div className="flex flex-col md:flex-row md:h-52">
                  <div className="w-full md:w-80 h-64 md:h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="flex-1 p-5">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-200"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gray-200"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Loading overlay for refetching */}
            {isRefetching && (
              <div className="mb-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200 animate-pulse">
                <div className="flex items-center gap-3">
                  <FiLoader className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Memperbarui data...</p>
                    <p className="text-xs text-blue-600">Mohon tunggu sebentar</p>
                  </div>
                </div>
              </div>
            )}

            {items.length > 0 ? (
              <div>
                {/* Results info */}
                <div className="mb-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-medium">Total Barang</p>
                        <p className="text-sm font-bold text-gray-900">
                          Menampilkan <span className="text-green-600">{items.length}</span> dari <span className="text-green-600">{totalItems}</span>{" "}
                          barang
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:ml-auto">
                      <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 font-medium">Halaman</p>
                        <p className="text-sm font-bold text-gray-900">
                          <span className="text-purple-600">{page}</span> dari <span className="text-purple-600">{totalPages}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items grid */}
                <div className="space-y-4 relative">
                  {/* Overlay saat refetching */}
                  {isRefetching && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center">
                      <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-200">
                        <FiLoader className="w-5 h-5 text-green-600 animate-spin" />
                        <span className="text-sm font-medium text-gray-700">Memuat data...</span>
                      </div>
                    </div>
                  )}

                  {items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2">
                    {HAS_PREVIOUS_PAGE && (
                      <Button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        variant="outline"
                        className="w-full sm:w-auto px-4 h-10 text-sm"
                        size="sm"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                        <span className="ml-1">Sebelumnya</span>
                      </Button>
                    )}

                    <div className="hidden sm:flex gap-1">
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
                            className={`w-10 h-10 p-0 text-sm ${page === pageNum ? "bg-green-600 hover:bg-green-700" : ""}`}
                            size="sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <div className="sm:hidden text-sm text-gray-600 font-medium">
                      {page} / {totalPages}
                    </div>

                    {HAS_NEXT_PAGE && (
                      <Button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        variant="outline"
                        className="w-full sm:w-auto px-4 h-10 text-sm"
                        size="sm"
                      >
                        <span className="mr-1">Selanjutnya</span>
                        <FiChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <FiSearch className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Tidak Ada Barang Ditemukan</h3>
                <p className="text-sm md:text-base text-gray-600 max-w-md mx-auto leading-relaxed px-4">
                  Tidak ada barang yang cocok dengan kriteria pencarian Anda.
                </p>
                {(searchTerm || selectedCategory) && (
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setPage(1);
                    }}
                    variant="outline"
                    className="mt-4 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
