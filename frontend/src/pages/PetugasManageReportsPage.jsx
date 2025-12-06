import { useState, useEffect } from "react";
import {
  FiPackage,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiClock,
  FiPlus,
  FiRefreshCw,
  FiTag,
  FiEdit,
  FiCheck,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { PetugasPagination } from "@/features/admin-management/components";

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    AVAILABLE: { label: "Tersedia", className: "bg-green-100 text-green-800", dot: "bg-green-500" },
    Tersedia: { label: "Tersedia", className: "bg-green-100 text-green-800", dot: "bg-green-500" },
    CLAIMED: { label: "Diambil", className: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
    Diambil: { label: "Diambil", className: "bg-red-100 text-red-800", dot: "bg-red-500" },
    DISPOSED: { label: "Dimusnahkan", className: "bg-red-100 text-red-800", dot: "bg-red-500" },
    Proses: { label: "Proses", className: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
  };

  const config = statusConfig[status] || statusConfig.AVAILABLE;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
      {config.label}
    </span>
  );
}

// Table Row Component for Desktop View
function ItemRow({ item, onEdit, onView, onDelete }) {
  return (
    <tr
      className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => onView(item)}
    >
      <td className="px-6 py-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden group">
          {item.photo || item.images?.[0] ? (
            <img
              src={item.photo || item.images[0]}
              alt={item.description || item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="text-gray-400 text-xl" />
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{item.description || item.name}</div>
        {(item.reportedBy || item.foundBy) && <div className="text-xs text-gray-400 mt-1">Dilaporkan oleh: {item.reportedBy || item.foundBy}</div>}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <FiCalendar className="mr-2 text-gray-400" />
          <span>{item.foundDate || new Date(item.dateFound).toLocaleDateString()}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <FiMapPin className="mr-1 text-gray-400" />
          <span>{item.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-600"
            title="Edit"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors text-red-600"
            title="Hapus"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// Item Card Component for Mobile View
function ItemCard({ item, onView, onEdit, onDelete }) {
  const statusConfig = {
    Tersedia: "bg-green-100 text-green-800",
    AVAILABLE: "bg-green-100 text-green-800",
    Diambil: "bg-red-100 text-red-800",
    CLAIMED: "bg-blue-100 text-blue-800",
    Proses: "bg-yellow-100 text-yellow-800",
    DISPOSED: "bg-red-100 text-red-800",
  };
  const statusColor = statusConfig[item.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex gap-4">
        {/* Foto Barang */}
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          {item.photo || item.images?.[0] ? (
            <img
              src={item.photo || item.images[0]}
              alt={item.name || item.description}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="text-gray-400 text-xl" />
            </div>
          )}
          {item.isNew && <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>}
        </div>

        {/* Info Utama */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-900">{item.name || item.description}</h4>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.description || (item.additionalNotes ? item.additionalNotes : "Tidak ada deskripsi")}
          </p>
        </div>
      </div>

      {/* Detail Tambahan */}
      <div className="border-t my-3 pt-3 space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <FiTag className="w-4 h-4 mr-2 text-gray-400" />
          <span>{item.category}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FiMapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>{item.foundDate || new Date(item.dateFound).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex items-center justify-end gap-2 border-t pt-3">
        <button
          onClick={() => onView(item)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          title="Lihat Detail"
        >
          <FiEye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
          title="Edit Item"
        >
          <FiEdit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Hapus Item"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Detail Modal Component with Claim Feature
function ItemDetailModal({ item, isOpen, onClose, onClaimSuccess }) {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [nim, setNim] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [claiming, setClaiming] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowClaimForm(false);
      setNim("");
      setStudentData(null);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  if (!item) return null;

  // Dummy data mahasiswa berdasarkan NIM
  const fetchStudentData = () => {
    if (!nim || nim.length < 8) {
      alert("Masukkan NIM yang valid (minimal 8 digit)");
      return;
    }

    setLoadingStudent(true);

    // Simulate API call
    setTimeout(() => {
      // Dummy data
      const dummyStudents = {
        21523001: {
          nim: "21523001",
          nama: "Ahmad Rizki Maulana",
          prodi: "Teknik Informatika",
          fakultas: "Sains dan Teknologi",
          angkatan: "2021",
          foto: "https://ui-avatars.com/api/?name=Ahmad+Rizki&background=3b82f6&color=fff&size=128",
          noHp: "081234567890",
          email: "ahmad.rizki@students.uin-suka.ac.id",
        },
        21523002: {
          nim: "21523002",
          nama: "Siti Nurhaliza",
          prodi: "Sistem Informasi",
          fakultas: "Sains dan Teknologi",
          angkatan: "2021",
          foto: "https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=ec4899&color=fff&size=128",
          noHp: "082345678901",
          email: "siti.nurhaliza@students.uin-suka.ac.id",
        },
        20523045: {
          nim: "20523045",
          nama: "Muhammad Fauzi",
          prodi: "Teknik Informatika",
          fakultas: "Sains dan Teknologi",
          angkatan: "2020",
          foto: "https://ui-avatars.com/api/?name=Muhammad+Fauzi&background=8b5cf6&color=fff&size=128",
          noHp: "083456789012",
          email: "muhammad.fauzi@students.uin-suka.ac.id",
        },
      };

      const student = dummyStudents[nim] || {
        nim: nim,
        nama: "Data Mahasiswa Tidak Ditemukan",
        prodi: "-",
        fakultas: "-",
        angkatan: "-",
        foto: "https://ui-avatars.com/api/?name=Unknown&background=9ca3af&color=fff&size=128",
        noHp: "-",
        email: "-",
      };

      setStudentData(student);
      setLoadingStudent(false);

      if (student.nama !== "Data Mahasiswa Tidak Ditemukan") {
        setShowConfirmation(true);
      }
    }, 1000);
  };

  const handleClaimConfirm = () => {
    setClaiming(true);

    // Simulate claim process
    setTimeout(() => {
      setClaiming(false);
      onClaimSuccess?.(item.id, studentData);
      onClose();

      // Reset form
      setShowClaimForm(false);
      setNim("");
      setStudentData(null);
      setShowConfirmation(false);
    }, 1500);
  };

  const canClaim = item.status === "Tersedia" || item.status === "AVAILABLE";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className="max-w-5xl! max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            <span>Detail Barang</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* Item Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Barang</label>
              <p className="text-sm text-gray-900 mt-1">{item.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(Array.isArray(item.category) ? item.category : [item.category]).map((cat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kondisi</label>
              <p className="text-sm text-gray-900 mt-1">{item.condition}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Lokasi Ditemukan</label>
              <p className="text-sm text-gray-900 mt-1">{item.location}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tanggal Ditemukan</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(item.dateFound).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ditemukan Oleh</label>
              <p className="text-sm text-gray-900 mt-1">{item.foundBy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tanggal Input</label>
              <p className="text-sm text-gray-900 mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <p className="text-sm text-gray-900 mt-1">{item.description}</p>
          </div>

          {item.additionalNotes && (
            <div>
              <label className="text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <p className="text-sm text-gray-900 mt-1">{item.additionalNotes}</p>
            </div>
          )}

          {/* Claim Section */}
          {canClaim && (
            <div className="border-t pt-6">
              {!showClaimForm ? (
                <Button
                  onClick={() => setShowClaimForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FiUser
                    className="mr-2"
                    size={16}
                  />
                  Proses Claim Barang
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Form Claim Barang</h3>

                  {/* NIM Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">NIM / NIP</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Masukkan NIM/NIP pemilik barang"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        className="flex-1"
                        maxLength={12}
                      />
                      <Button
                        onClick={fetchStudentData}
                        disabled={loadingStudent || !nim}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {loadingStudent ? (
                          <>
                            <FiRefreshCw
                              className="mr-2 animate-spin"
                              size={16}
                            />
                            Mencari...
                          </>
                        ) : (
                          <>
                            <FiSearch
                              className="mr-2"
                              size={16}
                            />
                            Cari
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Contoh NIM: 231060..., 10928273...</p>
                  </div>

                  {/* Student Data Display */}
                  {studentData && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex gap-4">
                        <img
                          src={studentData.foto}
                          alt={studentData.nama}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 space-y-2">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Nama Lengkap</label>
                            <p className="text-sm font-semibold text-gray-900">{studentData.nama}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500">NIM</label>
                              <p className="text-sm text-gray-900">{studentData.nim}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Angkatan</label>
                              <p className="text-sm text-gray-900">{studentData.angkatan}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Program Studi</label>
                              <p className="text-sm text-gray-900">{studentData.prodi}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Fakultas</label>
                              <p className="text-sm text-gray-900">{studentData.fakultas}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-medium text-gray-500">No. HP</label>
                              <p className="text-sm text-gray-900">{studentData.noHp}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Email</label>
                              <p className="text-sm text-gray-900 truncate">{studentData.email}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confirmation */}
                      {showConfirmation && (
                        <div className="mt-4 space-y-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <FiClock
                                className="text-yellow-600 mt-0.5"
                                size={18}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-yellow-900">Konfirmasi Claim Barang</p>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Pastikan data mahasiswa sudah sesuai. Setelah dikonfirmasi, barang akan ditandai sebagai sudah diambil oleh{" "}
                                  <span className="font-semibold">{studentData.nama}</span>.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setShowClaimForm(false);
                                setNim("");
                                setStudentData(null);
                                setShowConfirmation(false);
                              }}
                              variant="outline"
                              className="flex-1"
                            >
                              Batal
                            </Button>
                            <Button
                              onClick={handleClaimConfirm}
                              disabled={claiming}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              {claiming ? (
                                <>
                                  <FiRefreshCw
                                    className="mr-2 animate-spin"
                                    size={16}
                                  />
                                  Memproses...
                                </>
                              ) : (
                                <>
                                  <FiCheck
                                    className="mr-2"
                                    size={16}
                                  />
                                  Konfirmasi Claim
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancel Claim Form */}
                  {!showConfirmation && (
                    <Button
                      onClick={() => {
                        setShowClaimForm(false);
                        setNim("");
                        setStudentData(null);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Batal
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Already Claimed Notice */}
          {!canClaim && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <FiCheck
                  className="text-blue-600 mt-0.5"
                  size={18}
                />
                <div>
                  <p className="text-sm font-medium text-blue-900">Barang Sudah Diambil</p>
                  <p className="text-xs text-blue-700 mt-1">Barang ini sudah ditandai sebagai sudah diambil oleh pemiliknya.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PetugasManageReportsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock data - combining both data sources
  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const combinedMockItems = [
        // Data from Dashboard
        {
          id: 1,
          name: "Dompet Coklat",
          description: "Dompet Coklat",
          foundDate: "24 September 2025",
          dateFound: "2025-09-24",
          category: "Barang Pribadi",
          location: "Masjid UIN",
          status: "Tersedia",
          photo: null,
          images: [],
          isNew: true,
          reportedBy: "Satpam Ahmad",
          foundBy: "Satpam Ahmad",
          condition: "Baik",
          createdAt: "2025-09-24T10:30:00Z",
        },
        {
          id: 2,
          name: "Handphone Samsung Galaxy",
          description: "Handphone Samsung Galaxy",
          foundDate: "25 September 2025",
          dateFound: "2025-09-25",
          category: "Elektronik",
          location: "Tempat Parkir",
          status: "Diambil",
          photo: null,
          images: [],
          isNew: false,
          reportedBy: "Petugas Keamanan",
          foundBy: "Petugas Keamanan",
          condition: "Baik",
          createdAt: "2025-09-25T11:30:00Z",
        },
        {
          id: 3,
          name: "Kunci Motor Honda",
          description: "Kunci Motor Honda",
          foundDate: "25 September 2025",
          dateFound: "2025-09-25",
          category: "Kendaraan",
          location: "Tempat Parkir",
          status: "Proses",
          photo: null,
          images: [],
          isNew: false,
          reportedBy: "Mahasiswa",
          foundBy: "Mahasiswa",
          condition: "Baik",
          createdAt: "2025-09-25T14:30:00Z",
        },
        {
          id: 4,
          name: "Tas Ransel Hitam",
          description: "Tas Ransel Hitam",
          foundDate: "26 September 2025",
          dateFound: "2025-09-26",
          category: "Barang Pribadi",
          location: "Perpustakaan",
          status: "Tersedia",
          photo: null,
          images: [],
          isNew: true,
          reportedBy: "Petugas Perpus",
          foundBy: "Petugas Perpus",
          condition: "Baik",
          createdAt: "2025-09-26T09:30:00Z",
        },
        {
          id: 5,
          name: "Kacamata",
          description: "Kacamata",
          foundDate: "27 September 2025",
          dateFound: "2025-09-27",
          category: "Aksesori",
          location: "Ruang Kelas A",
          status: "Tersedia",
          photo: null,
          images: [],
          isNew: true,
          reportedBy: "Dosen",
          foundBy: "Dosen",
          condition: "Baik",
          createdAt: "2025-09-27T13:30:00Z",
        },
        // Additional items from original ManageReportsPage
        {
          id: 6,
          name: "iPhone 13 Pro",
          description: "iPhone 13 Pro warna biru, kondisi baik, ada casing transparan",
          foundDate: "15 Januari 2024",
          dateFound: "2024-01-15",
          category: "Elektronik",
          location: "Perpustakaan Lantai 2",
          status: "AVAILABLE",
          photo: null,
          images: ["https://placehold.co/600x400"],
          isNew: false,
          reportedBy: "Ahmad Petugas",
          foundBy: "Ahmad Petugas",
          condition: "Baik",
          createdAt: "2024-01-15T10:30:00Z",
          additionalNotes: "Ditemukan di meja baca nomor 15",
        },
        {
          id: 7,
          name: "Tas Ransel Hitam Eiger",
          description: "Tas ransel warna hitam merk Eiger, ada gantungan kunci",
          foundDate: "14 Januari 2024",
          dateFound: "2024-01-14",
          category: "Tas",
          location: "Gedung A Lantai 1",
          status: "CLAIMED",
          photo: null,
          images: ["https://placehold.co/600x400"],
          isNew: false,
          reportedBy: "Siti Petugas",
          foundBy: "Siti Petugas",
          condition: "Sangat Baik",
          createdAt: "2024-01-14T14:20:00Z",
        },
        {
          id: 8,
          name: "Dompet Kulit Coklat",
          description: "Dompet kulit warna coklat, berisi KTP dan kartu ATM",
          foundDate: "12 Januari 2024",
          dateFound: "2024-01-12",
          category: "Aksesoris",
          location: "Kantin Utama",
          status: "AVAILABLE",
          photo: null,
          images: ["https://placehold.co/600x400"],
          isNew: false,
          reportedBy: "Dewi Petugas",
          foundBy: "Dewi Petugas",
          condition: "Baik",
          createdAt: "2024-01-12T12:30:00Z",
        },
      ];

      setItems(combinedMockItems);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleEdit = (item) => {
    alert(`Edit item: ${item.name}`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Hapus barang "${item.name}"?`)) {
      setItems(items.filter((i) => i.id !== item.id));
    }
  };

  const handleClaimSuccess = (itemId, studentData) => {
    // Update item status to claimed
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: "CLAIMED",
            claimedBy: studentData.nama,
            claimedByNim: studentData.nim,
            claimedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    // Show success notification
    alert(`Barang berhasil di-claim oleh ${studentData.nama} (${studentData.nim})`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const categories = ["Elektronik", "Tas", "Aksesoris", "Dokumen", "Kendaraan", "Pakaian", "Barang Pribadi"];

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6 shadow-sm border-0">
        <CardContent className="p-0">
          <div className="px-4 sm:px-6 pb-6 border-b bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">Daftar Barang Temuan</h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw className={`text-sm ${loading ? "animate-spin" : ""}`} />
                  <span className="text-sm hidden sm:inline">Refresh</span>
                </button>
                <Button>
                  <FiPlus className="text-sm" />
                  <span className="text-sm">Tambah Item</span>
                </Button>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari barang, lokasi, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Tersedia">Tersedia</SelectItem>
                    <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                    <SelectItem value="Diambil">Diambil</SelectItem>
                    <SelectItem value="CLAIMED">Diambil</SelectItem>
                    <SelectItem value="Proses">Proses</SelectItem>
                    <SelectItem value="DISPOSED">Dimusnahkan</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
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
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal Penemuan</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-gray-500">
                        {searchTerm || filterStatus !== "all" || categoryFilter !== "all"
                          ? "Tidak ada barang yang sesuai dengan filter"
                          : "Tidak ada barang temuan"}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden bg-gray-50 p-4 space-y-4">
            {loading ? (
              <div className="p-12 text-center flex items-center justify-center">
                <FiRefreshCw className="animate-spin mr-2" />
                <span>Memuat data...</span>
              </div>
            ) : paginatedItems.length > 0 ? (
              paginatedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Tidak ada barang yang sesuai dengan filter"
                  : "Tidak ada barang temuan"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && filteredItems.length > 0 && totalPages > 1 && (
        <PetugasPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredItems.length}
          currentCount={paginatedItems.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onClaimSuccess={handleClaimSuccess}
      />
    </div>
  );
}
