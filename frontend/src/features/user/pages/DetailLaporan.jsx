import { useNavigate, useParams } from "react-router";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiMail,
  FiClock,
  FiPackage,
  FiTag,
  FiLoader,
  FiAlertCircle,
  FiPhone,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBarangTemuanDetail } from "../queries/useBarangTemuan";
import { getImageUrl } from "@/utils/imageHelper";
import { SafeImage } from "@/components/ui/safe-image";

// Helper functions
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getReportTypeLabel = (type) => {
  return type === "BELUM_DIAMBIL" ? "Belum Diambil" : "Sudah Diambil";
};

const getReportTypeColor = (type) => {
  return type === "SUDAH_DIAMBIL"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-yellow-100 text-yellow-800 border-yellow-200";
};

export default function Detaillaporan() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch barang detail from API
  const {
    data: barangDetail,
    isLoading,
    isError,
    error,
  } = useBarangTemuanDetail(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat detail barang...</p>
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
            {error?.message || "Terjadi kesalahan saat memuat detail barang."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Map backend response to frontend format
  const item = barangDetail
    ? {
        id: barangDetail.id,
        item_name: barangDetail.nama_barang,
        description: barangDetail.deskripsi,
        report_status: barangDetail.status,
        place_found:
          barangDetail.lokasi_umum && barangDetail.lokasi_spesifik
            ? `${barangDetail.lokasi_umum} - ${barangDetail.lokasi_spesifik}`
            : barangDetail.lokasi_umum ||
              barangDetail.lokasi_spesifik ||
              "Lokasi tidak diketahui",
        lokasi_umum: barangDetail.lokasi_umum,
        lokasi_spesifik: barangDetail.lokasi_spesifik,
        tanggal_ditemukan: barangDetail.tanggal_ditemukan,
        perkiraan_waktu_ditemukan: barangDetail.perkiraan_waktu_ditemukan,
        created_at: barangDetail.created_at,
        updated_at: barangDetail.updated_at,
        waktu_diambil: barangDetail.waktu_diambil,
        category: {
          name: barangDetail.kategori?.nama || "Tidak ada kategori",
        },
        created_by: {
          profile: {
            full_name: barangDetail.pencatat?.profile?.full_name || "Unknown",
            email: barangDetail.pencatat?.profile?.email,
            nim: barangDetail.pencatat?.profile?.nim,
            nip: barangDetail.pencatat?.profile?.nip,
            phone_number: barangDetail.pencatat?.profile?.phone_number,
            lokasi_pos: barangDetail.pencatat?.profile?.lokasi_pos,
          },
        },
        claimed_by: barangDetail.nama_pengambil
          ? {
              profile: {
                full_name: barangDetail.nama_pengambil,
                identitas: barangDetail.identitas_pengambil,
                kontak: barangDetail.kontak_pengambil,
              },
            }
          : null,
        report_images: barangDetail.foto_barang || [],
        foto_bukti_klaim: barangDetail.foto_bukti_klaim || [],
      }
    : null;

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Barang Tidak Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Barang yang Anda cari tidak ditemukan.
          </p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div>
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and status */}
            <Card className="border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {item.item_name}
                    </h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getReportTypeColor(
                          item.report_status
                        )}`}
                      >
                        {getReportTypeLabel(item.report_status)}
                      </span>

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 border border-gray-200">
                        <FiTag className="w-4 h-4" />
                        {item.category.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    Deskripsi Lengkap
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            {item.report_images && item.report_images.length > 0 && (
              <Card className="border border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">
                    Foto Barang ({item.report_images.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.report_images.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <SafeImage
                          src={getImageUrl(image.url_gambar)}
                          alt={`Foto barang ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          fallbackClassName="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Utama
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Claim process atau status sudah diambil */}
            {item.report_status === "BELUM_DIAMBIL" ? (
              <Card className="border-l-4 border-l-green-600 border border-gray-200 shadow-md bg-green-50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                    <FiPackage className="w-5 h-5" />
                    Cara Mengklaim Barang
                  </h3>
                  <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Siapkan identitas diri yang valid (KTM/KTP)</li>
                      <li>Siapkan bukti kepemilikan barang</li>
                      <li>
                        Silahkan datangi Pos{" "}
                        <span className="font-bold text-green-700">
                          {item.created_by?.profile?.lokasi_pos || "Satpam"}
                        </span>{" "}
                        untuk melakukan claim barang
                      </li>
                      <li>Lakukan verifikasi kepemilikan dengan petugas</li>
                    </ol>
                  </div>

                  {/* Informasi Tambahan Lokasi */}
                  {(item.lokasi_umum ||
                    item.lokasi_spesifik ||
                    item.perkiraan_waktu_ditemukan) && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                        Detail Penemuan
                      </h4>
                      <div className="space-y-2 text-sm">
                        {item.lokasi_umum && (
                          <p className="text-blue-800">
                            <span className="font-medium">Lokasi Umum:</span>{" "}
                            {item.lokasi_umum}
                          </p>
                        )}
                        {item.lokasi_spesifik && (
                          <p className="text-blue-800">
                            <span className="font-medium">
                              Lokasi Spesifik:
                            </span>{" "}
                            {item.lokasi_spesifik}
                          </p>
                        )}
                        {item.perkiraan_waktu_ditemukan && (
                          <p className="text-blue-800">
                            <span className="font-medium">
                              Perkiraan Waktu:
                            </span>{" "}
                            {item.perkiraan_waktu_ditemukan}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-yellow-900 text-sm font-semibold">
                        Verifikasi Identitas Diperlukan
                      </p>
                      <p className="text-yellow-800 text-xs mt-1">
                        Pastikan Anda membawa dokumen identitas yang valid dan
                        bukti kepemilikan untuk mempercepat proses klaim
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-l-4 border-l-green-600 border border-gray-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2 text-green-900">
                        Barang Sudah Diambil
                      </h3>
                      <p className="text-green-800 text-sm leading-relaxed mb-4">
                        Barang ini telah diklaim dan diambil oleh pemiliknya
                        pada{" "}
                        <span className="font-semibold">
                          {formatDateTime(
                            item.waktu_diambil || item.updated_at
                          )}
                        </span>
                        .
                      </p>
                      {item.claimed_by && (
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-green-200">
                          <p className="text-xs font-medium text-green-600 mb-2">
                            Informasi Pengambil
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-green-900">
                              {item.claimed_by.profile.full_name}
                            </p>
                            {item.claimed_by.profile.identitas && (
                              <p className="text-xs text-green-700">
                                Identitas: {item.claimed_by.profile.identitas}
                              </p>
                            )}
                            {item.claimed_by.profile.kontak && (
                              <p className="text-xs text-green-700">
                                Kontak: {item.claimed_by.profile.kontak}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Foto Bukti Klaim */}
                      {item.foto_bukti_klaim &&
                        item.foto_bukti_klaim.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-medium text-green-600 mb-2">
                              Foto Bukti Klaim
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {item.foto_bukti_klaim.map((foto, index) => (
                                <SafeImage
                                  key={foto.id}
                                  src={getImageUrl(foto.url_gambar)}
                                  alt={`Bukti klaim ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border border-green-200"
                                  fallbackClassName="w-full h-20"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card className="border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-5 text-gray-900">
                  Informasi Detail
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Tanggal Laporan
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FiClock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Waktu Laporan
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateTime(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Lokasi
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.place_found}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <FiPackage className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Terakhir Update
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateTime(item.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact information */}
            <Card className="border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-5 text-gray-900">
                  Kontak Petugas
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Nama Lengkap
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.created_by.profile.full_name}
                      </p>
                    </div>
                  </div>

                  {item.created_by.profile.lokasi_pos && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Lokasi Pos
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.created_by.profile.lokasi_pos}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.phone_number && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <FiPhone className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          No. Telepon
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.created_by.profile.phone_number}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FiMail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Email
                        </p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.created_by.profile.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.nim && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          NIM
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.created_by.profile.nim}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.nip && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          NIP
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.created_by.profile.nip}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
