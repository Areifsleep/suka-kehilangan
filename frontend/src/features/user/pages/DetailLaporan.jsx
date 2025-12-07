import { useNavigate, useParams } from "react-router";
import { FiArrowLeft, FiMapPin, FiCalendar, FiUser, FiMail, FiClock, FiPackage, FiMessageCircle, FiTag } from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dummy data sesuai schema database - untuk preview UI
const dummyReport = {
  id: "abc123",
  item_name: "Dompet Kulit Coklat",
  description:
    "Dompet kulit coklat tua dengan bahan kulit sintetis berkualitas. Ditemukan dalam kondisi tertutup rapat. Di dalam dompet terdapat beberapa kartu identitas dan uang tunai. Barang ini ditemukan oleh petugas keamanan saat melakukan patroli rutin di area masjid kampus pada pagi hari. Dompet memiliki ukuran sedang dengan beberapa slot kartu dan satu kompartemen utama untuk uang kertas.",
  report_type: "FOUND", // FOUND atau LOST
  report_status: "OPEN", // OPEN, CLAIMED, CLOSED
  place_found: "Masjid UIN Sunan Kalijaga",
  created_at: "2025-09-25T14:30:00Z",
  updated_at: "2025-09-25T14:30:00Z",
  category: {
    name: "Dompet",
  },
  created_by: {
    profile: {
      full_name: "Ahmad Satpam",
      email: "ahmad.satpam@uin.ac.id",
      nim: null,
      nip: "198505152010011001",
    },
  },
  report_images: [
    {
      id: "img1",
      storage_key: "dummy-image-1.jpg",
      original_filename: "dompet-depan.jpg",
      is_primary: true,
    },
    {
      id: "img2",
      storage_key: "dummy-image-2.jpg",
      original_filename: "dompet-dalam.jpg",
      is_primary: false,
    },
  ],
};

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
  return type === "FOUND" ? "Ditemukan" : "Dicari";
};

const getReportTypeColor = (type) => {
  return type === "FOUND" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200";
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

const getStatusColor = (status) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "CLAIMED":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "CLOSED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Detaillaporan() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Gunakan dummy data untuk preview UI
  const item = dummyReport;

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">{item.item_name}</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getReportTypeColor(item.report_type)}`}
                      >
                        {getReportTypeLabel(item.report_type)}
                      </span>
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(
                          item.report_status
                        )}`}
                      >
                        {getStatusLabel(item.report_status)}
                      </span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 border border-gray-200">
                        <FiTag className="w-4 h-4" />
                        {item.category.name}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Deskripsi Lengkap</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            {item.report_images && item.report_images.length > 0 && (
              <Card className="border border-gray-200 shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">Foto Barang ({item.report_images.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.report_images.map((image, index) => (
                      <div
                        key={image.id}
                        className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <span className="text-gray-500 text-sm font-medium">{image.is_primary ? "Foto Utama" : `Foto ${index + 1}`}</span>
                          </div>
                        </div>
                        {image.is_primary && (
                          <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Utama</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Claim process untuk barang yang ditemukan */}
            {item.report_type === "FOUND" && item.report_status === "OPEN" && (
              <Card className="border-l-4 border-l-green-600 border border-gray-200 shadow-md bg-green-50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-green-900 flex items-center gap-2">
                    <FiPackage className="w-5 h-5" />
                    Cara Mengklaim Barang
                  </h3>
                  <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Hubungi pelapor melalui kontak yang tersedia</li>
                      <li>Siapkan identitas diri yang valid (KTM/KTP)</li>
                      <li>Siapkan bukti kepemilikan barang</li>
                      <li>Datang langsung ke lokasi yang ditentukan pelapor</li>
                      <li>Lakukan verifikasi kepemilikan dengan petugas</li>
                    </ol>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-yellow-900 text-sm font-semibold">Verifikasi Identitas Diperlukan</p>
                      <p className="text-yellow-800 text-xs mt-1">
                        Pastikan Anda membawa dokumen identitas yang valid dan bukti kepemilikan untuk mempercepat proses klaim
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info untuk barang yang dicari */}
            {item.report_type === "LOST" && (
              <Card className="border-l-4 border-l-yellow-600 border border-gray-200 shadow-md bg-yellow-50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 text-yellow-900 flex items-center gap-2">
                    <FiMessageCircle className="w-5 h-5" />
                    Menemukan Barang Ini?
                  </h3>
                  <div className="bg-white rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-700 mb-3">
                      Jika Anda menemukan barang ini, silakan hubungi pemilik melalui kontak yang tersedia di samping.
                    </p>
                    <p className="text-sm text-gray-600">
                      Kami sangat menghargai bantuan Anda dalam mengembalikan barang yang hilang kepada pemiliknya.
                    </p>
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
                <h3 className="font-bold text-lg mb-5 text-gray-900">Informasi Detail</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">Tanggal Laporan</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDate(item.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FiClock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">Waktu Laporan</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDateTime(item.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">Lokasi</p>
                      <p className="text-sm font-semibold text-gray-900">{item.place_found}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <FiPackage className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">Terakhir Update</p>
                      <p className="text-sm font-semibold text-gray-900">{formatDateTime(item.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact information */}
            <Card className="border border-gray-200 shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-5 text-gray-900">Kontak Pelapor</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <FiUser className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 mb-1">Nama Lengkap</p>
                      <p className="text-sm font-semibold text-gray-900">{item.created_by.profile.full_name}</p>
                    </div>
                  </div>

                  {item.created_by.profile.email && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FiMail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.created_by.profile.email}</p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.nim && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">NIM</p>
                        <p className="text-sm font-semibold text-gray-900">{item.created_by.profile.nim}</p>
                      </div>
                    </div>
                  )}

                  {item.created_by.profile.nip && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 mb-1">NIP</p>
                        <p className="text-sm font-semibold text-gray-900">{item.created_by.profile.nip}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6">
                    <FiMessageCircle className="w-5 h-5 mr-2" />
                    Hubungi Pelapor
                  </Button>

                  {item.report_type === "FOUND" && item.report_status === "OPEN" && (
                    <Button
                      variant="outline"
                      className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold py-6"
                    >
                      <FiPackage className="w-5 h-5 mr-2" />
                      Klaim Barang Ini
                    </Button>
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
