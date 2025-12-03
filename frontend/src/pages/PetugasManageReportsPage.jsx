import { useState, useEffect } from "react";
import { FiPackage, FiSearch, FiFilter, FiEye, FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiUser, FiClock, FiMoreVertical, FiX } from "react-icons/fi";

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
    AVAILABLE: { label: "Tersedia", className: "bg-green-100 text-green-800" },
    CLAIMED: { label: "Diambil", className: "bg-blue-100 text-blue-800" },
    DISPOSED: { label: "Dimusnahkan", className: "bg-red-100 text-red-800" },
  };

  const config = statusConfig[status] || statusConfig.AVAILABLE;

  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>{config.label}</span>;
}

// Item Card Component
function ItemCard({ item, onView, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
            <StatusBadge status={item.status} />
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 p-0"
            >
              <FiMoreVertical size={16} />
            </Button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onView(item);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <FiEye
                    className="mr-2"
                    size={14}
                  />
                  Lihat
                </button>
                <button
                  onClick={() => {
                    onEdit(item);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <FiEdit2
                    className="mr-2"
                    size={14}
                  />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(item);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center"
                >
                  <FiTrash2
                    className="mr-2"
                    size={14}
                  />
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <FiMapPin
              className="mr-2"
              size={14}
            />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar
              className="mr-2"
              size={14}
            />
            <span>{new Date(item.dateFound).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FiUser
              className="mr-2"
              size={14}
            />
            <span>{item.foundBy}</span>
          </div>
        </div>

        {item.images && item.images.length > 0 && (
          <div className="mt-3">
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-32 object-cover rounded-lg"
            />
            {item.images.length > 1 && <p className="text-xs text-gray-500 mt-1">+{item.images.length - 1} foto lainnya</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Detail Modal Component
function ItemDetailModal({ item, isOpen, onClose }) {
  if (!item) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detail Barang</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <FiX size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {item.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${item.name} ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nama Barang</label>
              <p className="text-sm text-gray-900 mt-1">{item.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Kategori</label>
              <p className="text-sm text-gray-900 mt-1">{item.category}</p>
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

  // Mock data
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: "iPhone 13 Pro",
        category: "Elektronik",
        description: "iPhone 13 Pro warna biru, kondisi baik, ada casing transparan",
        location: "Perpustakaan Lantai 2",
        dateFound: "2024-01-15",
        condition: "Baik",
        status: "AVAILABLE",
        foundBy: "Ahmad Petugas",
        createdAt: "2024-01-15T10:30:00Z",
        images: ["https://placehold.co/600x400"],
        additionalNotes: "Ditemukan di meja baca nomor 15",
      },
      {
        id: 2,
        name: "Tas Ransel Hitam",
        category: "Tas",
        description: "Tas ransel warna hitam merk Eiger, ada gantungan kunci",
        location: "Gedung A Lantai 1",
        dateFound: "2024-01-14",
        condition: "Sangat Baik",
        status: "CLAIMED",
        foundBy: "Siti Petugas",
        createdAt: "2024-01-14T14:20:00Z",
        images: ["https://placehold.co/600x400"],
      },
      {
        id: 3,
        name: "Kunci Motor Honda",
        category: "Kendaraan",
        description: "Kunci motor Honda dengan gantungan kunci bergambar doraemon",
        location: "Parkiran Motor",
        dateFound: "2024-01-13",
        condition: "Baik",
        status: "AVAILABLE",
        foundBy: "Budi Petugas",
        createdAt: "2024-01-13T16:45:00Z",
        images: ["https://placehold.co/600x400"],
      },
      {
        id: 4,
        name: "Dompet Kulit Coklat",
        category: "Aksesoris",
        description: "Dompet kulit warna coklat, berisi KTP dan kartu ATM",
        location: "Kantin Utama",
        dateFound: "2024-01-12",
        condition: "Baik",
        status: "AVAILABLE",
        foundBy: "Dewi Petugas",
        createdAt: "2024-01-12T12:30:00Z",
        images: ["https://placehold.co/600x400"],
      },
    ];

    setTimeout(() => {
      setItems(mockItems);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
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

  const categories = ["Elektronik", "Tas", "Aksesoris", "Dokumen", "Kendaraan", "Pakaian"];

  return (
    <div>
      {/* <HeaderDashboard title="Manajemen Barang" /> */}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari barang..."
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
                  <SelectItem value="AVAILABLE">Tersedia</SelectItem>
                  <SelectItem value="CLAIMED">Diambil</SelectItem>
                  <SelectItem value="DISPOSED">Dimusnahkan</SelectItem>
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
                <p className="text-sm text-gray-600">Total Barang</p>
                <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              </div>
              <FiPackage className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tersedia</p>
                <p className="text-2xl font-bold text-green-600">{items.filter((item) => item.status === "AVAILABLE").length}</p>
              </div>
              <FiClock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Diambil</p>
                <p className="text-2xl font-bold text-blue-600">{items.filter((item) => item.status === "CLAIMED").length}</p>
              </div>
              <FiUser className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dimusnahkan</p>
                <p className="text-2xl font-bold text-red-600">{items.filter((item) => item.status === "DISPOSED").length}</p>
              </div>
              <FiTrash2 className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      ) : filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {paginatedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <PetugasPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={filteredItems.length}
              currentCount={paginatedItems.length}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada barang</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Tidak ada barang yang sesuai dengan filter"
                : "Belum ada barang yang diunggah"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
