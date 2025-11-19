import { useState, useEffect } from "react";
import {
  FiFileText,
  FiSearch,
  FiDownload,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiPackage,
  FiClock,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeaderDashboard } from "@/components/common";
import { PetugasPagination } from "@/features/admin-management/components";

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    PENDING: {
      label: "Menunggu",
      className: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
    },
    APPROVED: {
      label: "Disetujui",
      className: "bg-green-100 text-green-800",
      icon: FiCheckCircle,
    },
    REJECTED: {
      label: "Ditolak",
      className: "bg-red-100 text-red-800",
      icon: FiXCircle,
    },
    FOUND: {
      label: "Ditemukan",
      className: "bg-blue-100 text-blue-800",
      icon: FiPackage,
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className} flex items-center gap-1`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}

// Report Card Component
function ReportCard({ report, onView }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{report.itemName}</h3>
            <p className="text-sm text-gray-600 mb-2">{report.category}</p>
            <StatusBadge status={report.status} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(report)}
            className="h-8 w-8 p-0"
          >
            <FiEye size={16} />
          </Button>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FiUser
              className="mr-2"
              size={14}
            />
            <span>{report.reportedBy}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin
              className="mr-2"
              size={14}
            />
            <span>{report.lastSeenLocation}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar
              className="mr-2"
              size={14}
            />
            <span>Hilang: {new Date(report.lostDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FiClock
              className="mr-2"
              size={14}
            />
            <span>Dilaporkan: {new Date(report.reportedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {report.images && report.images.length > 0 && (
          <div className="mt-3">
            <img
              src={report.images[0]}
              alt={report.itemName}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-700 line-clamp-2">{report.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Detail Modal Component
function ReportDetailModal({ report, isOpen, onClose }) {
  if (!report) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detail Laporan Kehilangan</span>
            <StatusBadge status={report.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {report.images && report.images.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Foto Barang</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {report.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${report.itemName} ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Barang</label>
              <p className="text-sm text-gray-900 mt-1">{report.itemName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <p className="text-sm text-gray-900 mt-1">{report.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Warna</label>
              <p className="text-sm text-gray-900 mt-1">{report.color}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Merk/Brand</label>
              <p className="text-sm text-gray-900 mt-1">{report.brand || "-"}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{report.description}</p>
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Lokasi Terakhir</label>
              <p className="text-sm text-gray-900 mt-1">{report.lastSeenLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tanggal Hilang</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(report.lostDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Reporter Info */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Informasi Pelapor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama</label>
                <p className="text-sm text-gray-900 mt-1">{report.reportedBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900 mt-1">{report.reporterEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                <p className="text-sm text-gray-900 mt-1">{report.reporterPhone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Laporan</label>
                <p className="text-sm text-gray-900 mt-1">{new Date(report.reportedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Status History */}
          {report.statusHistory && report.statusHistory.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Riwayat Status</h4>
              <div className="space-y-2">
                {report.statusHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <StatusBadge status={history.status} />
                      {history.note && <p className="text-sm text-gray-600 mt-1">{history.note}</p>}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>{new Date(history.date).toLocaleDateString()}</p>
                      <p>{history.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {report.additionalNotes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{report.additionalNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PetugasReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock data
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        itemName: 'MacBook Pro 13"',
        category: "Elektronik",
        description: "MacBook Pro 13 inch warna silver, ada stiker Apple di bagian belakang",
        color: "Silver",
        brand: "Apple",
        lastSeenLocation: "Perpustakaan Lantai 3",
        lostDate: "2024-01-15",
        reportedBy: "Andi Mahasiswa",
        reporterEmail: "andi@student.ac.id",
        reporterPhone: "08123456789",
        reportedAt: "2024-01-16T09:30:00Z",
        status: "APPROVED",
        images: ["https://placehold.co/600x400"],
        additionalNotes: "Sangat penting, berisi tugas akhir",
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-16T09:30:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
          {
            status: "APPROVED",
            date: "2024-01-16T14:00:00Z",
            updatedBy: "Ahmad Petugas",
            note: "Laporan telah diverifikasi dan disetujui",
          },
        ],
      },
      {
        id: 2,
        itemName: "Dompet Kulit Hitam",
        category: "Aksesoris",
        description: "Dompet kulit hitam merk Louis Vuitton, berisi KTP dan SIM",
        color: "Hitam",
        brand: "Louis Vuitton",
        lastSeenLocation: "Kantin Gedung B",
        lostDate: "2024-01-14",
        reportedBy: "Sari Mahasiswi",
        reporterEmail: "sari@student.ac.id",
        reporterPhone: "08987654321",
        reportedAt: "2024-01-14T14:20:00Z",
        status: "FOUND",
        images: ["https://placehold.co/600x400"],
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-14T14:20:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
          {
            status: "APPROVED",
            date: "2024-01-14T16:00:00Z",
            updatedBy: "Ahmad Petugas",
            note: "Laporan diverifikasi",
          },
          {
            status: "FOUND",
            date: "2024-01-15T10:30:00Z",
            updatedBy: "Siti Petugas",
            note: "Barang ditemukan dan sudah dikembalikan ke pemilik",
          },
        ],
      },
      {
        id: 3,
        itemName: "Kacamata Minus",
        category: "Aksesoris",
        description: "Kacamata minus dengan frame plastik warna biru",
        color: "Biru",
        brand: "Optik Melawai",
        lastSeenLocation: "Ruang Kelas A201",
        lostDate: "2024-01-13",
        reportedBy: "Budi Mahasiswa",
        reporterEmail: "budi@student.ac.id",
        reporterPhone: "08555666777",
        reportedAt: "2024-01-13T11:15:00Z",
        status: "REJECTED",
        images: ["https://placehold.co/600x400"],
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-13T11:15:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
          {
            status: "REJECTED",
            date: "2024-01-13T15:30:00Z",
            updatedBy: "Siti Petugas",
            note: "Informasi tidak lengkap, foto tidak jelas",
          },
        ],
      },
      {
        id: 4,
        itemName: "Tas Ransel Adidas",
        category: "Tas",
        description: "Tas ransel Adidas warna hitam dengan logo putih, ukuran sedang",
        color: "Hitam",
        brand: "Adidas",
        lastSeenLocation: "Lapangan Basket",
        lostDate: "2024-01-12",
        reportedBy: "Dewi Mahasiswi",
        reporterEmail: "dewi@student.ac.id",
        reporterPhone: "08111222333",
        reportedAt: "2024-01-12T16:45:00Z",
        status: "PENDING",
        images: ["https://placehold.co/600x400"],
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-12T16:45:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
        ],
      },
      {
        id: 5,
        itemName: "Tas Ransel Adidas",
        category: "Tas",
        description: "Tas ransel Adidas warna hitam dengan logo putih, ukuran sedang",
        color: "Hitam",
        brand: "Adidas",
        lastSeenLocation: "Lapangan Basket",
        lostDate: "2024-01-12",
        reportedBy: "Dewi Mahasiswi",
        reporterEmail: "dewi@student.ac.id",
        reporterPhone: "08111222333",
        reportedAt: "2024-01-12T16:45:00Z",
        status: "PENDING",
        images: ["https://placehold.co/600x400"],
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-12T16:45:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
        ],
      },
      {
        id: 6,
        itemName: "Tas Ransel Adidas",
        category: "Tas",
        description: "Tas ransel Adidas warna hitam dengan logo putih, ukuran sedang",
        color: "Hitam",
        brand: "Adidas",
        lastSeenLocation: "Lapangan Basket",
        lostDate: "2024-01-12",
        reportedBy: "Dewi Mahasiswi",
        reporterEmail: "dewi@student.ac.id",
        reporterPhone: "08111222333",
        reportedAt: "2024-01-12T16:45:00Z",
        status: "PENDING",
        images: ["https://placehold.co/600x400"],
        statusHistory: [
          {
            status: "PENDING",
            date: "2024-01-12T16:45:00Z",
            updatedBy: "Sistem",
            note: "Laporan baru diterima",
          },
        ],
      },
    ];

    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const reportDate = new Date(report.reportedAt);
      const today = new Date();
      const diffTime = Math.abs(today - reportDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case "7days":
          matchesDate = diffDays <= 7;
          break;
        case "30days":
          matchesDate = diffDays <= 30;
          break;
        case "90days":
          matchesDate = diffDays <= 90;
          break;
        default:
          matchesDate = true;
      }
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleView = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleExportReports = () => {
    // Simulate CSV export
    const csvContent = [
      "ID,Nama Barang,Kategori,Pelapor,Tanggal Hilang,Status",
      ...filteredReports.map(
        (report) =>
          `${report.id},"${report.itemName}","${report.category}","${report.reportedBy}","${new Date(report.lostDate).toLocaleDateString()}","${
            report.status
          }"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-kehilangan-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categories = ["Elektronik", "Tas", "Aksesoris", "Dokumen", "Kendaraan", "Pakaian"];

  return (
    <div>
      <HeaderDashboard title="Laporan Kehilangan" />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari laporan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter group diubah menjadi grid yang responsif */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                  <SelectItem value="FOUND">Ditemukan</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={dateFilter}
                onValueChange={setDateFilter}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Periode</SelectItem>
                  <SelectItem value="7days">7 Hari</SelectItem>
                  <SelectItem value="30days">30 Hari</SelectItem>
                  <SelectItem value="90days">90 Hari</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExportReports}
                variant="outline"
                className="w-full"
              >
                <FiDownload
                  className="mr-0 sm:mr-2"
                  size={16}
                />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FiFileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-600">{reports.filter((report) => report.status === "PENDING").length}</p>
              </div>
              <FiClock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-green-600">{reports.filter((report) => report.status === "APPROVED").length}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditemukan</p>
                <p className="text-2xl font-bold text-blue-600">{reports.filter((report) => report.status === "FOUND").length}</p>
              </div>
              <FiPackage className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{reports.filter((report) => report.status === "REJECTED").length}</p>
              </div>
              <FiXCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card
              key={i}
              className="animate-pulse"
            >
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReports.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onView={handleView}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <PetugasPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={filteredReports.length}
              currentCount={paginatedReports.length}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Tidak ada laporan yang sesuai dengan filter"
                : "Belum ada laporan kehilangan"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
