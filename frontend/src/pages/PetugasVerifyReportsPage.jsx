import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiPackage,
  FiAlertCircle,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { HeaderDashboard } from "@/components/common";
import { PetugasPagination } from "@/features/admin-management/components";

// Status Badge Component
function VerificationStatusBadge({ status }) {
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

// Verification Card Component
function VerificationCard({ item, onView, onApprove, onReject }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.itemName}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
            <VerificationStatusBadge status={item.verificationStatus} />
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(item)}
              className="h-8 w-8 p-0"
            >
              <FiEye size={16} />
            </Button>

            {item.verificationStatus === "PENDING" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(item)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <FiCheck size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(item)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <FiX size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FiUser
              className="mr-2"
              size={14}
            />
            <span>Dilaporkan oleh: {item.reportedBy}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin
              className="mr-2"
              size={14}
            />
            <span>{item.lastSeenLocation}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar
              className="mr-2"
              size={14}
            />
            <span>Hilang: {new Date(item.lostDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FiClock
              className="mr-2"
              size={14}
            />
            <span>Dilaporkan: {new Date(item.reportedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {item.images && item.images.length > 0 && (
          <div className="mt-3">
            <img
              src={item.images[0]}
              alt={item.itemName}
              className="w-full h-32 object-cover rounded-lg"
            />
            {item.images.length > 1 && <p className="text-xs text-gray-500 mt-1">+{item.images.length - 1} foto lainnya</p>}
          </div>
        )}

        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
          <p className="text-gray-700">{item.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Detail Modal Component
function VerificationDetailModal({ item, isOpen, onClose, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!item) return null;

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(item.id);
      onClose();
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Alasan penolakan harus diisi");
      return;
    }

    setProcessing(true);
    try {
      await onReject(item.id, rejectionReason);
      onClose();
      setRejectionReason("");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Verifikasi Laporan Kehilangan</span>
            <VerificationStatusBadge status={item.verificationStatus} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {item.images && item.images.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Foto Barang</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${item.itemName} ${index + 1}`}
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
              <p className="text-sm text-gray-900 mt-1">{item.itemName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <p className="text-sm text-gray-900 mt-1">{item.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Warna</label>
              <p className="text-sm text-gray-900 mt-1">{item.color}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Merk/Brand</label>
              <p className="text-sm text-gray-900 mt-1">{item.brand || "-"}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{item.description}</p>
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Lokasi Terakhir</label>
              <p className="text-sm text-gray-900 mt-1">{item.lastSeenLocation}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tanggal Hilang</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(item.lostDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Reporter Info */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Informasi Pelapor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama</label>
                <p className="text-sm text-gray-900 mt-1">{item.reportedBy}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900 mt-1">{item.reporterEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                <p className="text-sm text-gray-900 mt-1">{item.reporterPhone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Tanggal Laporan</label>
                <p className="text-sm text-gray-900 mt-1">{new Date(item.reportedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {item.additionalNotes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded">{item.additionalNotes}</p>
            </div>
          )}

          {/* Verification Actions */}
          {item.verificationStatus === "PENDING" && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Aksi Verifikasi</h4>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Alasan Penolakan (jika ditolak)</label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Masukkan alasan penolakan..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {processing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <FiCheck className="mr-2" />
                    )}
                    Setujui Laporan
                  </Button>

                  <Button
                    onClick={handleReject}
                    disabled={processing || !rejectionReason.trim()}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 flex-1"
                  >
                    {processing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div> : <FiX className="mr-2" />}
                    Tolak Laporan
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Verification Result */}
          {item.verificationStatus !== "PENDING" && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Hasil Verifikasi</h4>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm">
                  <strong>Status:</strong> {item.verificationStatus === "APPROVED" ? "Disetujui" : "Ditolak"}
                </p>
                {item.verificationReason && (
                  <p className="text-sm mt-1">
                    <strong>Alasan:</strong> {item.verificationReason}
                  </p>
                )}
                <p className="text-sm mt-1">
                  <strong>Diverifikasi oleh:</strong> {item.verifiedBy || "Sistem"}
                </p>
                <p className="text-sm mt-1">
                  <strong>Tanggal:</strong> {new Date(item.verifiedAt || item.reportedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PetugasVerifyReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
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
        verificationStatus: "PENDING",
        images: ["https://placehold.co/600x400"],
        additionalNotes: "Sangat penting, berisi tugas akhir",
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
        verificationStatus: "APPROVED",
        verifiedBy: "Ahmad Petugas",
        verifiedAt: "2024-01-14T16:00:00Z",
        images: ["https://placehold.co/600x400"],
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
        verificationStatus: "REJECTED",
        verificationReason: "Informasi tidak lengkap, foto tidak jelas",
        verifiedBy: "Siti Petugas",
        verifiedAt: "2024-01-13T15:30:00Z",
        images: ["https://placehold.co/600x400"],
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
        verificationStatus: "PENDING",
        images: ["https://placehold.co/600x400"],
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
    const matchesStatus = statusFilter === "all" || report.verificationStatus === statusFilter;
    const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const paginatedReports = filteredReports.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleView = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleApprove = async (reportId) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              verificationStatus: "APPROVED",
              verifiedBy: "Current Petugas",
              verifiedAt: new Date().toISOString(),
            }
          : report
      )
    );
    alert("Laporan berhasil disetujui!");
  };

  const handleReject = async (reportId, reason) => {
    setReports(
      reports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              verificationStatus: "REJECTED",
              verificationReason: reason,
              verifiedBy: "Current Petugas",
              verifiedAt: new Date().toISOString(),
            }
          : report
      )
    );
    alert("Laporan berhasil ditolak!");
  };

  const categories = ["Elektronik", "Tas", "Aksesoris", "Dokumen", "Kendaraan", "Pakaian"];

  return (
    <div>
      <HeaderDashboard title="Verifikasi Laporan Kehilangan" />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
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

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Menunggu</SelectItem>
                  <SelectItem value="APPROVED">Disetujui</SelectItem>
                  <SelectItem value="REJECTED">Ditolak</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[140px]">
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Laporan</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <FiPackage className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-yellow-600">{reports.filter((report) => report.verificationStatus === "PENDING").length}</p>
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
                <p className="text-2xl font-bold text-green-600">{reports.filter((report) => report.verificationStatus === "APPROVED").length}</p>
              </div>
              <FiCheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-red-600">{reports.filter((report) => report.verificationStatus === "REJECTED").length}</p>
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
              <VerificationCard
                key={report.id}
                item={report}
                onView={handleView}
                onApprove={handleApprove}
                onReject={(item) => {
                  const reason = prompt("Masukkan alasan penolakan:");
                  if (reason) {
                    handleReject(item.id, reason);
                  }
                }}
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
                : "Belum ada laporan kehilangan yang perlu diverifikasi"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <VerificationDetailModal
        item={selectedReport}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
