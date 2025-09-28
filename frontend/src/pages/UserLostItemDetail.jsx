import React from "react";
import { useNavigate, useParams } from "react-router";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiClock,
  FiPackage,
  FiMessageCircle,
} from "react-icons/fi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeaderDashboard } from "@/components/HeaderDashboard";

// Dummy data untuk demo
const itemDetails = {
  1: {
    id: 1,
    title: "Dompet Coklat",
    description:
      "Barang bertuktik ditemukan diskeitiak Masjid UIN. Bagi yang merasa kehilangan silahkan menghubungi Pos Satpam deket Masjid UIN untuk melakukan verifikasi.",
    fullDescription:
      "Dompet berwarna coklat tua dengan bahan kulit sintetis. Ditemukan dalam kondisi tertutup rapat. Di dalam dompet terdapat beberapa kartu identitas dan uang tunai. Barang ini ditemukan oleh petugas keamanan saat melakukan patroli rutin di area masjid kampus.",
    status: "Ditemukan",
    location: "Masjid UIN",
    specificLocation: "Dekat tempat wudhu area putra",
    date: "25 September 2025",
    time: "14:30 WIB",
    reporter: "Petugas Satpam",
    reporterContact: {
      phone: "0812-3456-7890",
      email: "satpam@uin.ac.id",
    },
    images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    category: "Dompet",
    itemCondition: "Baik",
    identificationRequired: true,
    claimProcess:
      "Datang langsung ke Pos Satpam dengan membawa identitas diri dan bukti kepemilikan",
  },
};

export default function UserLostItemDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const item = itemDetails[id];

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Item Tidak Ditemukan
          </h2>
          <Button
            onClick={() => navigate("/user")}
            className="bg-green-600 hover:bg-green-700"
          >
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard
        title="Detail Barang Hilang"
        subtitle="Informasi lengkap tentang barang yang dilaporkan"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/user")}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and status */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <FiPackage className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {item.fullDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Foto Barang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">
                          Foto {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Claim process */}
            {item.status.toLowerCase() === "ditemukan" && (
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4 text-green-800">
                    Cara Mengambil Barang
                  </h3>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-green-800 text-sm">
                      {item.claimProcess}
                    </p>
                  </div>
                  {item.identificationRequired && (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-5 h-5 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5"></div>
                      <div>
                        <p className="text-yellow-800 text-sm font-medium">
                          Verifikasi Identitas Diperlukan
                        </p>
                        <p className="text-yellow-700 text-xs mt-1">
                          Siapkan bukti kepemilikan dan identitas diri yang
                          valid
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Informasi Detail</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiCalendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Tanggal Ditemukan
                      </p>
                      <p className="text-sm text-gray-600">{item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiClock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Waktu Ditemukan
                      </p>
                      <p className="text-sm text-gray-600">{item.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Lokasi Ditemukan
                      </p>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      {item.specificLocation && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.specificLocation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiPackage className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Kondisi Barang
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.itemCondition}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact information */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Kontak Pelapor</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FiUser className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.reporter}
                      </p>
                    </div>
                  </div>

                  {item.reporterContact.phone && (
                    <div className="flex items-center gap-3">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {item.reporterContact.phone}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.reporterContact.email && (
                    <div className="flex items-center gap-3">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          {item.reporterContact.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <FiMessageCircle className="w-4 h-4 mr-2" />
                    Hubungi Pelapor
                  </Button>

                  {item.status.toLowerCase() === "ditemukan" && (
                    <Button
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
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
