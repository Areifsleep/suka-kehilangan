import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
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
  FiX,
  FiAlertTriangle,
  FiFileText,
  FiUpload,
} from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { BarangPagination } from "../components/BarangPagination";
import { toast } from "react-toastify";
import {
  usePetugasBarangTemuanList,
  usePetugasCategories,
} from "../queries/useBarangTemuan";
import { useDeleteBarangTemuan } from "../mutations/useBarangTemuan";
import { petugasBarangTemuanApi } from "../api/barangTemuanApi";
import { getImageUrl } from "@/utils/imageHelper";
import { useDebounce } from "@/hooks/useDebounce";
import { SafeImage } from "@/components/ui/safe-image";

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    BELUM_DIAMBIL: {
      label: "Belum Diambil",
      className: "bg-green-100 text-green-800",
      dot: "bg-green-500",
    },
    SUDAH_DIAMBIL: {
      label: "Sudah Diambil",
      className: "bg-blue-100 text-blue-800",
      dot: "bg-blue-500",
    },
    DIMUSNAHKAN: {
      label: "Dimusnahkan",
      className: "bg-red-100 text-red-800",
      dot: "bg-red-500",
    },
  };

  const config = statusConfig[status] || statusConfig.BELUM_DIAMBIL;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${config.className}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></div>
      {config.label}
    </span>
  );
}

// Table Row Component for Desktop View
function ItemRow({ item, onEdit, onView, onDelete, onViewClaim }) {
  const isClaimed = item.raw?.status === "SUDAH_DIAMBIL";

  return (
    <tr
      className="border-b hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
      onClick={() => onView(item)}
    >
      <td className="px-6 py-4">
        <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden group">
          {item.photo || item.images?.[0] ? (
            <SafeImage
              src={item.photo || item.images[0]}
              alt={item.description || item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackClassName="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="text-gray-400 text-xl" />
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{item.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-sm text-gray-700">
          <FiCalendar className="mr-2 text-gray-400" />
          <span>
            {item.foundDate || new Date(item.dateFound).toLocaleDateString()}
          </span>
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
            onClick={(e) => {
              e.stopPropagation();
              onView(item);
            }}
            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors text-blue-600"
            title="Lihat Detail"
          >
            <FiEye className="text-sm" />
          </button>
          {isClaimed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewClaim(item);
              }}
              className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors text-green-600"
              title="Detail Klaim"
            >
              <FiFileText className="text-sm" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
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
    BELUM_DIAMBIL: "bg-green-100 text-green-800",
    SUDAH_DIAMBIL: "bg-blue-100 text-blue-800",
    DIMUSNAHKAN: "bg-red-100 text-red-800",
  };
  const statusColor = statusConfig[item.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex gap-4">
        {/* Foto Barang */}
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
          {item.photo || item.images?.[0] ? (
            <SafeImage
              src={item.photo || item.images[0]}
              alt={item.name || item.description}
              className="w-full h-full object-cover"
              fallbackClassName="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FiPackage className="text-gray-400 text-xl" />
            </div>
          )}
          {item.isNew && (
            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* Info Utama */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-gray-900">
              {item.name || item.description}
            </h4>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {item.description ||
              (item.additionalNotes
                ? item.additionalNotes
                : "Tidak ada deskripsi")}
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
          <span>
            {item.foundDate || new Date(item.dateFound).toLocaleDateString()}
          </span>
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

// Detail Modal Component with Claim Feature and Edit Mode
function ItemDetailModal({ item, isOpen, onClose, onClaimSuccess, onUpdate }) {
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const claimFormRef = useRef(null);

  // Claim form data - sesuai dengan schema database
  const [claimData, setClaimData] = useState({
    nama_pengambil: "",
    identitas_pengambil: "", // NIM, NIP, atau No KTP
    kontak_pengambil: "",
    keterangan_klaim: "",
    foto_bukti_klaim: [], // Array untuk multiple files
  });

  // State untuk preview images dengan validasi
  const [selectedClaimImages, setSelectedClaimImages] = useState([]);
  const [isDraggingClaim, setIsDraggingClaim] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowClaimForm(false);
      setIsEditMode(false);
      setEditedItem(null);
      setClaimData({
        nama_pengambil: "",
        identitas_pengambil: "",
        kontak_pengambil: "",
        keterangan_klaim: "",
        foto_bukti_klaim: [],
      });
      // Cleanup preview URLs
      selectedClaimImages.forEach((img) => URL.revokeObjectURL(img.preview));
      setSelectedClaimImages([]);
    } else if (item) {
      // Initialize edited item with current item data
      setEditedItem({
        name: item.name || "",
        category: item.category || "",
        description: item.description || "",
        location: item.location || "",
        condition: item.condition || "",
        foundBy: item.foundBy || "",
        additionalNotes: item.additionalNotes || "",
      });
    }
  }, [isOpen, item]);

  // Auto-scroll to claim form when it appears
  useEffect(() => {
    if (showClaimForm && claimFormRef.current) {
      setTimeout(() => {
        claimFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showClaimForm]);

  if (!item) return null;

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset to original item data
    setEditedItem({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      location: item.location || "",
      condition: item.condition || "",
      foundBy: item.foundBy || "",
      additionalNotes: item.additionalNotes || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);
      // TODO: Call update API when backend is ready
      // await updateFoundItem({ id: item.id, ...editedItem });

      // For now, just call the onUpdate callback if provided
      if (onUpdate) {
        await onUpdate(item.id, editedItem);
      }

      setIsEditMode(false);
      toast.success("Berhasil memperbarui data barang!");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Gagal memperbarui data barang");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedItem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClaimInputChange = (field, value) => {
    setClaimData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processClaimFiles(files);
  };

  const processClaimFiles = (files) => {
    const fileArray = Array.from(files);

    // Filter hanya file gambar
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validasi maksimal 3 file
    if (imageFiles.length + selectedClaimImages.length > 3) {
      toast.error("Maksimal 3 gambar yang dapat diunggah");
      return;
    }

    // Validasi ukuran file (maksimal 5MB per file)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizedFiles.length > 0) {
      toast.error("Ukuran file maksimal 5MB per gambar");
      return;
    }

    // Buat preview untuk setiap file
    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setSelectedClaimImages((prev) => [...prev, ...newImages]);

    // Update claimData dengan file yang sudah tervalidasi
    setClaimData((prev) => ({
      ...prev,
      foto_bukti_klaim: [...prev.foto_bukti_klaim, ...imageFiles],
    }));
  };

  const handleDragEnterClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClaim(true);
  };

  const handleDragLeaveClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if leaving the drop area completely
    if (e.currentTarget === e.target) {
      setIsDraggingClaim(false);
    }
  };

  const handleDragOverClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClaim(true);
  };

  const handleDropClaim = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClaim(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processClaimFiles(files);
    }
  };

  const removeClaimImage = (index) => {
    setSelectedClaimImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });

    setClaimData((prev) => ({
      ...prev,
      foto_bukti_klaim: prev.foto_bukti_klaim.filter((_, i) => i !== index),
    }));
  };

  const handleClaimConfirm = async () => {
    // Validasi form
    if (
      !claimData.nama_pengambil ||
      !claimData.identitas_pengambil ||
      !claimData.kontak_pengambil
    ) {
      toast.error("Mohon lengkapi data pengambil barang");
      return;
    }

    try {
      setClaiming(true);

      // Call API to process claim
      const response = await petugasBarangTemuanApi.markDiambil(
        item.raw.id,
        {
          nama_pengambil: claimData.nama_pengambil,
          identitas_pengambil: claimData.identitas_pengambil,
          kontak_pengambil: claimData.kontak_pengambil,
          keterangan_klaim: claimData.keterangan_klaim || "",
        },
        claimData.foto_bukti_klaim
      );

      // Call success callback to update UI
      if (onClaimSuccess) {
        onClaimSuccess(item.id, {
          nama: claimData.nama_pengambil,
          identitas: claimData.identitas_pengambil,
          kontak: claimData.kontak_pengambil,
        });
      }

      // Close modal and reset form
      onClose();
    } catch (error) {
      console.error("Error claiming item:", error);
      toast.error(
        error.response?.data?.message || "Gagal memproses claim barang"
      );
    } finally {
      setClaiming(false);
    }
  };

  const canClaim =
    item.status === "BELUM_DIAMBIL" || item.raw?.status === "BELUM_DIAMBIL";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl! max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center mpr-8">
            <span>{isEditMode ? "Edit Barang" : "Detail Barang"}</span>
            {!showClaimForm && !isEditMode && (
              <button
                onClick={handleEditClick}
                className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50"
                title="Edit barang"
              >
                <FiEdit className="w-5 h-5" />
              </button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((image, index) => (
                <SafeImage
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                  fallbackClassName="w-full h-32"
                />
              ))}
            </div>
          )}

          {/* Item Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Nama Barang
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedItem.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama barang"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{item.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Kategori
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedItem.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kategori"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {(Array.isArray(item.category)
                    ? item.category
                    : [item.category]
                  ).map((cat, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Kondisi
              </label>
              {isEditMode ? (
                <select
                  value={editedItem.condition}
                  onChange={(e) =>
                    handleInputChange("condition", e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih kondisi</option>
                  <option value="Baik">Baik</option>
                  <option value="Cukup Baik">Cukup Baik</option>
                  <option value="Rusak">Rusak</option>
                </select>
              ) : (
                <p className="text-sm text-gray-900 mt-1">{item.condition}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Lokasi Ditemukan
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedItem.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lokasi ditemukan"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{item.location}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tanggal Ditemukan
              </label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(item.dateFound).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ditemukan Oleh
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={editedItem.foundBy}
                  onChange={(e) => handleInputChange("foundBy", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nama penemu"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{item.foundBy}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tanggal Input
              </label>
              <p className="text-sm text-gray-900 mt-1">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Deskripsi
            </label>
            {isEditMode ? (
              <textarea
                value={editedItem.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Deskripsi barang"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{item.description}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Catatan Tambahan
            </label>
            {isEditMode ? (
              <textarea
                value={editedItem.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Catatan tambahan (opsional)"
              />
            ) : (
              item.additionalNotes && (
                <p className="text-sm text-gray-900 mt-1">
                  {item.additionalNotes}
                </p>
              )
            )}
          </div>

          {/* Edit Mode Actions */}
          {isEditMode && (
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          )}

          {/* Claim Section - Hide when in edit mode */}
          {canClaim && !isEditMode && (
            <div className="border-t pt-6" ref={claimFormRef}>
              {!showClaimForm ? (
                <Button
                  onClick={() => setShowClaimForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FiUser className="mr-2" size={16} />
                  Proses Claim Barang
                </Button>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Form Claim Barang
                  </h3>

                  {/* Nama Pengambil */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nama Lengkap Pengambil{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Masukkan nama lengkap pengambil barang"
                      value={claimData.nama_pengambil}
                      onChange={(e) =>
                        handleClaimInputChange("nama_pengambil", e.target.value)
                      }
                      className="w-full"
                      maxLength={255}
                      required
                    />
                  </div>

                  {/* Identitas Pengambil */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      NIM / NIP / No. KTP{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Masukkan NIM, NIP, atau No. KTP"
                      value={claimData.identitas_pengambil}
                      onChange={(e) =>
                        handleClaimInputChange(
                          "identitas_pengambil",
                          e.target.value
                        )
                      }
                      className="w-full"
                      maxLength={100}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Contoh: 21523001 (NIM), 198501012010011001 (NIP),
                      3304012345670001 (KTP)
                    </p>
                  </div>

                  {/* Kontak Pengambil */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nomor HP/WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="Masukkan nomor HP/WhatsApp"
                      value={claimData.kontak_pengambil}
                      onChange={(e) =>
                        handleClaimInputChange(
                          "kontak_pengambil",
                          e.target.value
                        )
                      }
                      className="w-full"
                      maxLength={50}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Contoh: 081234567890
                    </p>
                  </div>

                  {/* Keterangan Klaim */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Keterangan Klaim (Opsional)
                    </label>
                    <textarea
                      placeholder="Catatan tambahan atau keterangan terkait pengambilan barang"
                      value={claimData.keterangan_klaim}
                      onChange={(e) =>
                        handleClaimInputChange(
                          "keterangan_klaim",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                      rows="3"
                    />
                  </div>

                  {/* Foto Bukti Klaim */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Foto Bukti Pengambilan (Opsional)
                    </label>

                    {/* Drag & Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
                        isDraggingClaim
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
                      }`}
                      onDragEnter={handleDragEnterClaim}
                      onDragOver={handleDragOverClaim}
                      onDragLeave={handleDragLeaveClaim}
                      onDrop={handleDropClaim}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="claimImageUpload"
                      />
                      <label
                        htmlFor="claimImageUpload"
                        className="cursor-pointer block"
                      >
                        <div className="w-14 h-14 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <FiUpload className="w-7 h-7 text-blue-600" />
                        </div>
                        <p className="text-gray-700 font-semibold text-sm mb-1">
                          {isDraggingClaim
                            ? "Lepaskan file di sini"
                            : "Klik untuk upload gambar atau drag & drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Upload foto bukti pengambilan (KTP, selfie dengan
                          barang, dll).
                        </p>
                        <p className="text-xs text-gray-500">
                          Maksimal 3 foto, ukuran maksimal 5MB per foto.
                        </p>
                      </label>
                    </div>

                    {/* Preview Images dengan tombol hapus */}
                    {selectedClaimImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {selectedClaimImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeClaimImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 rounded-b-lg truncate px-2">
                              {image.name.length > 12
                                ? image.name.substring(0, 12) + "..."
                                : image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Waktu Diambil Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <FiClock className="text-blue-600 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          Informasi Waktu Pengambilan
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Waktu pengambilan barang akan dicatat secara otomatis
                          saat Anda mengonfirmasi claim.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setShowClaimForm(false);
                        setClaimData({
                          nama_pengambil: "",
                          identitas_pengambil: "",
                          kontak_pengambil: "",
                          keterangan_klaim: "",
                          foto_bukti_klaim: [],
                        });
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleClaimConfirm}
                      disabled={
                        claiming ||
                        !claimData.nama_pengambil ||
                        !claimData.identitas_pengambil ||
                        !claimData.kontak_pengambil
                      }
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
                          <FiCheck className="mr-2" size={16} />
                          Konfirmasi Claim
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Already Claimed Notice */}
          {!canClaim && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <FiCheck className="text-blue-600 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Barang Sudah Diambil
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Barang ini sudah ditandai sebagai sudah diambil oleh
                    pemiliknya.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Claim Detail Modal Component
function ClaimDetailModal({ item, isOpen, onClose }) {
  if (!item || !item.raw) return null;

  const claimData = item.raw;
  const hasClaimInfo = claimData.status === "SUDAH_DIAMBIL";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Detail Klaim Barang
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Barang */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">
              Informasi Barang
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama Barang:</span>
                <span className="font-medium text-gray-900">
                  {claimData.nama_barang}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-medium text-gray-900">
                  {claimData.kategori?.nama || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lokasi Ditemukan:</span>
                <span className="font-medium text-gray-900">
                  {claimData.lokasi_umum}
                  {claimData.lokasi_spesifik &&
                    ` - ${claimData.lokasi_spesifik}`}
                </span>
              </div>
            </div>
          </div>

          {/* Info Pengambil */}
          {hasClaimInfo && (
            <>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <FiUser className="mr-2" />
                  Data Pengambil
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Nama:</span>
                    <span className="font-medium text-green-900">
                      {claimData.nama_pengambil || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Identitas:</span>
                    <span className="font-medium text-green-900">
                      {claimData.identitas_pengambil || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Kontak:</span>
                    <span className="font-medium text-green-900">
                      {claimData.kontak_pengambil || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Waktu Diambil:</span>
                    <span className="font-medium text-green-900">
                      {claimData.waktu_diambil
                        ? new Date(claimData.waktu_diambil).toLocaleString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Keterangan Klaim */}
              {claimData.keterangan_klaim && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <FiFileText className="mr-2" />
                    Keterangan Klaim
                  </h3>
                  <p className="text-sm text-blue-800">
                    {claimData.keterangan_klaim}
                  </p>
                </div>
              )}

              {/* Foto Bukti Klaim */}
              {claimData.foto_bukti_klaim &&
                claimData.foto_bukti_klaim.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Foto Bukti Pengambilan
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {claimData.foto_bukti_klaim.map((foto, index) => (
                        <div
                          key={foto.id}
                          className="relative aspect-video rounded-lg overflow-hidden border border-gray-200"
                        >
                          <SafeImage
                            src={getImageUrl(foto.url_gambar)}
                            alt={`Bukti klaim ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Petugas Penyerah */}
              {claimData.penyerah && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <FiUser className="mr-2" />
                    Petugas Penyerah
                  </h3>
                  <p className="text-sm text-gray-700">
                    {claimData.penyerah.profile?.full_name || "-"}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Tombol Close */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PetugasManageReportsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showClaimDetailModal, setShowClaimDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch real items for petugas using React Query hook
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Delete mutation
  const deleteBarangMutation = useDeleteBarangTemuan();

  const {
    data: listData,
    isLoading: listLoading,
    isError: listError,
    refetch: refetchList,
  } = usePetugasBarangTemuanList({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    kategori_id: categoryFilter === "all" ? undefined : categoryFilter,
  });

  // Fetch categories
  const { data: categoriesData } = usePetugasCategories();

  useEffect(() => {
    setLoading(listLoading);
  }, [listLoading]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter, categoryFilter]);

  useEffect(() => {
    if (listData && listData.data) {
      const mapped = listData.data.map((b) => ({
        id: b.id,
        name: b.nama_barang,
        description: b.deskripsi,
        foundDate: b.tanggal_ditemukan
          ? new Date(b.tanggal_ditemukan).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : null,
        dateFound: b.tanggal_ditemukan,
        category: b.kategori?.nama,
        location:
          b.lokasi_umum && b.lokasi_spesifik
            ? `${b.lokasi_umum} - ${b.lokasi_spesifik}`
            : b.lokasi_umum || b.lokasi_spesifik || "Lokasi tidak diketahui",
        status: b.status, // Gunakan status langsung dari backend
        photo:
          b.foto_barang && b.foto_barang[0]
            ? getImageUrl(b.foto_barang[0].url_gambar)
            : null,
        images: b.foto_barang
          ? b.foto_barang.map((f) => getImageUrl(f.url_gambar))
          : [],
        isNew: false,
        reportedBy: b.pencatat?.profile?.full_name,
        foundBy: b.pencatat?.profile?.full_name,
        condition: "-",
        createdAt: b.created_at,
        raw: b,
      }));

      setItems(mapped);
    }
  }, [listData]);

  // Get pagination metadata from backend response
  const totalPages = listData?.meta?.totalPages || 1;
  const totalItems = listData?.meta?.total || 0;
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const handleView = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleViewClaim = (item) => {
    setSelectedItem(item);
    setShowClaimDetailModal(true);
  };

  const handleEdit = (item) => {
    alert(`Edit item: ${item.name}`);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        // Call API to delete barang from backend
        await deleteBarangMutation.mutateAsync(itemToDelete.raw.id);

        // Close modal
        setShowDeleteModal(false);
        setItemToDelete(null);

        // Refetch list to update UI
        await refetchList();
      } catch (error) {
        // Error already handled by mutation (toast shown)
        console.error("Error deleting item:", error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleClaimSuccess = async (itemId, claimantData) => {
    // Refetch data dari backend untuk update UI
    await refetchList();

    // Show success notification menggunakan toast
    toast.success(`Barang berhasil di-claim oleh ${claimantData.nama}`);
  };

  const handleUpdate = async (itemId, updatedData) => {
    // Update item in the list
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            ...updatedData,
          };
        }
        return item;
      })
    );

    // Also update selectedItem if it's the one being edited
    setSelectedItem((prev) => {
      if (prev && prev.id === itemId) {
        return {
          ...prev,
          ...updatedData,
        };
      }
      return prev;
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleTambahItem = () => {
    navigate("/petugas/upload");
  };

  // Get categories from API response
  const categories = categoriesData || [];

  return (
    <div>
      {/* Filters */}
      <Card className="mb-6 shadow-sm border-0">
        <CardContent className="p-0">
          <div className="px-4 sm:px-6 pb-6 border-b bg-gray-50/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Daftar Barang Temuan
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <FiRefreshCw
                    className={`text-sm ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="text-sm hidden sm:inline">Refresh</span>
                </button>
                <Button onClick={handleTambahItem}>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="BELUM_DIAMBIL">Tersedia</SelectItem>
                    <SelectItem value="SUDAH_DIAMBIL">Diambil</SelectItem>
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
                      <SelectItem key={category.id} value={category.id}>
                        {category.nama}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Tanggal Penemuan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onView={handleView}
                      onViewClaim={handleViewClaim}
                      onDelete={handleDelete}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        categoryFilter !== "all"
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
            ) : items.length > 0 ? (
              items.map((item) => (
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
                {searchTerm ||
                statusFilter !== "all" ||
                categoryFilter !== "all"
                  ? "Tidak ada barang yang sesuai dengan filter"
                  : "Tidak ada barang temuan"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && items.length > 0 && totalPages > 1 && (
        <BarangPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={totalItems}
          currentCount={items.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onClaimSuccess={handleClaimSuccess}
        onUpdate={handleUpdate}
      />

      {/* Claim Detail Modal */}
      <ClaimDetailModal
        item={selectedItem}
        isOpen={showClaimDetailModal}
        onClose={() => setShowClaimDetailModal(false)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Hapus Barang
              </h3>
              <button
                onClick={handleDeleteCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-900 font-medium mb-2">
                    Apakah Anda yakin ingin menghapus barang ini?
                  </p>
                  <div className="bg-gray-50 rounded-md p-3 mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {itemToDelete.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lokasi: {itemToDelete.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-sm text-red-700">
                  <strong>Perhatian:</strong> Tindakan ini tidak dapat
                  dibatalkan. Data barang akan dihapus secara permanen.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  disabled={deleteBarangMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleteBarangMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteBarangMutation.isPending ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    "Hapus"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
