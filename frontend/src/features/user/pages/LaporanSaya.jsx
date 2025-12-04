import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiEye, FiEdit3, FiTrash2, FiMapPin, FiCalendar, FiPlus, FiFilter, FiSearch, FiSave } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";

// Dummy data sesuai schema database
const userReports = [
  {
    id: "abc123",
    item_name: "Kunci Motor Yamaha",
    description: "Kunci motor Yamaha dengan gantungan doraemon. Hilang saat parkir di area fakultas.",
    report_type: "LOST", // FOUND atau LOST
    report_status: "OPEN", // OPEN, CLAIMED, CLOSED
    place_found: "Area Parkir Fakultas",
    created_at: "2025-09-20T14:30:00Z",
    updated_at: "2025-09-21T10:00:00Z",
    category: {
      name: "Kunci",
    },
    created_by: {
      profile: {
        full_name: "Anda",
      },
    },
  },
  {
    id: "def456",
    item_name: "Dompet Kulit Hitam",
    description: "Dompet kulit hitam merk fossil. Berisi KTM, KTP dan beberapa kartu.",
    report_type: "LOST",
    report_status: "CLAIMED",
    place_found: "Perpustakaan",
    created_at: "2025-09-18T10:15:00Z",
    updated_at: "2025-09-22T15:30:00Z",
    claimed_at: "2025-09-22T15:30:00Z",
    category: {
      name: "Dompet",
    },
    created_by: {
      profile: {
        full_name: "Anda",
      },
    },
  },
  {
    id: "ghi789",
    item_name: "Jaket Hoodie Hitam",
    description: "Jaket hoodie hitam ukuran L merk Uniqlo. Ada logo kecil di bagian dada.",
    report_type: "FOUND",
    report_status: "CLOSED",
    place_found: "Ruang Kuliah A.302",
    created_at: "2025-09-10T08:00:00Z",
    updated_at: "2025-09-10T08:00:00Z",
    category: {
      name: "Pakaian",
    },
    created_by: {
      profile: {
        full_name: "Anda",
      },
    },
  },
];

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
    month: "short",
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

// Modal Edit Component
function EditModal({ report, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    item_name: report?.item_name || "",
    description: report?.description || "",
    place_found: report?.place_found || "",
    report_type: report?.report_type || "LOST",
    category_name: report?.category?.name || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Update form when report changes
  React.useEffect(() => {
    if (report) {
      setFormData({
        item_name: report.item_name,
        description: report.description,
        place_found: report.place_found,
        report_type: report.report_type,
        category_name: report.category.name,
      });
    }
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave({ ...report, ...formData, category: { name: formData.category_name } });
      toast.success("Laporan berhasil diperbarui");
      onClose();
    } catch (error) {
      toast.error("Gagal memperbarui laporan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Laporan</DialogTitle>
          <DialogDescription>Perbarui informasi laporan Anda</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Nama Barang */}
          <div className="space-y-2">
            <Label
              htmlFor="item_name"
              className="text-sm font-semibold text-gray-700"
            >
              Nama Barang <span className="text-red-500">*</span>
            </Label>
            <Input
              id="item_name"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="Contoh: Dompet Kulit Hitam"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label
              htmlFor="category_name"
              className="text-sm font-semibold text-gray-700"
            >
              Kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category_name"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              placeholder="Contoh: Dompet, Kunci, Tas, dll"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Tipe Laporan */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">
              Tipe Laporan <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, report_type: "LOST" }))}
                className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                  formData.report_type === "LOST"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-yellow-300"
                }`}
              >
                Dicari (Hilang)
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, report_type: "FOUND" }))}
                className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                  formData.report_type === "FOUND"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-green-300"
                }`}
              >
                Ditemukan
              </button>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <Label
              htmlFor="place_found"
              className="text-sm font-semibold text-gray-700"
            >
              Lokasi {formData.report_type === "FOUND" ? "Ditemukan" : "Terakhir Terlihat"} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="place_found"
                name="place_found"
                value={formData.place_found}
                onChange={handleChange}
                placeholder="Contoh: Perpustakaan, Area Parkir, dll"
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700"
            >
              Deskripsi <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Jelaskan detail barang, ciri-ciri khusus, atau informasi tambahan..."
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
            <p className="text-xs text-gray-500">{formData.description.length} karakter</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LaporanSayaPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(userReports);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Filter reports
  const filteredReports = reports.filter((report) => {
    // Filter by search term
    const matchSearch = searchTerm
      ? report.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.place_found.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Filter by status
    const matchFilter = filter === "all" || report.report_status === filter;

    return matchSearch && matchFilter;
  });

  const handleViewReport = (report) => {
    navigate(`/user/item/${report.id}`);
  };

  const handleEditReport = (report) => {
    setSelectedReport(report);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (updatedReport) => {
    setReports((prev) => prev.map((r) => (r.id === updatedReport.id ? { ...updatedReport, updated_at: new Date().toISOString() } : r)));
  };

  const handleDeleteReport = async (report) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus laporan "${report.item_name}"?`)) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setReports((prev) => prev.filter((r) => r.id !== report.id));
        toast.success("Laporan berhasil dihapus");
      } catch (error) {
        toast.error("Gagal menghapus laporan");
      }
    }
  };

  const filterOptions = [
    { value: "all", label: "Semua Status" },
    { value: "OPEN", label: "Terbuka" },
    { value: "CLAIMED", label: "Diklaim" },
    { value: "CLOSED", label: "Selesai" },
  ];

  return (
    <>
      <div>
        <EditModal
          report={selectedReport}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedReport(null);
          }}
          onSave={handleSaveEdit}
        />

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiSearch className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Cari laporan berdasarkan nama barang, lokasi, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-lg text-base bg-white transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap lg:flex-nowrap">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? "default" : "outline"}
                  onClick={() => setFilter(option.value)}
                >
                  <FiFilter className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Add Button */}
            <Button onClick={() => navigate("/user/report")}>
              <FiPlus className="w-4 h-4 mr-2" />
              Buat Laporan
            </Button>
          </div>

          {/* Results count */}
          {filteredReports.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-bold text-green-600">{filteredReports.length}</span> dari{" "}
                <span className="font-bold">{reports.length}</span> laporan
              </p>
            </div>
          )}
        </div>

        {/* Data Table */}
        {filteredReports.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Barang</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal Dibuat</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Terakhir Update</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50"
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{report.item_name}</span>
                          <span className="text-sm text-gray-500 line-clamp-1">{report.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-700 border border-gray-200">
                          {report.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border ${getReportTypeColor(
                            report.report_type
                          )}`}
                        >
                          {getReportTypeLabel(report.report_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${getStatusColor(
                            report.report_status
                          )}`}
                        >
                          {getStatusLabel(report.report_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FiMapPin className="w-4 h-4 text-gray-400" />
                          <span>{report.place_found}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FiCalendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(report.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(report.updated_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {report.report_status === "OPEN" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditReport(report)}
                              className="text-blue-700 hover:bg-blue-50 border-blue-300"
                              title="Edit Laporan"
                            >
                              <FiEdit3 className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReport(report)}
                            className="text-red-700 hover:bg-red-50 border-red-300"
                            title="Hapus Laporan"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tidak Ada Laporan Ditemukan</h3>
            <p className="text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
              {searchTerm || filter !== "all"
                ? "Tidak ada laporan yang cocok dengan kriteria pencarian atau filter Anda."
                : "Anda belum membuat laporan kehilangan. Mulai buat laporan untuk barang yang hilang atau ditemukan."}
            </p>
            {searchTerm || filter !== "all" ? (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                variant="outline"
                className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold"
              >
                Reset Filter
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/user/report")}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Buat Laporan Pertama
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
