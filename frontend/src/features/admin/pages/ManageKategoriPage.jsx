import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { KategoriPagination } from "../components/KategoriPagination";

import { useKategoriList } from "../queries/useKategori";
import {
  useCreateKategori,
  useUpdateKategori,
  useDeleteKategori,
} from "../mutations/useKategoriMutations";

export default function ManageKategoriPage() {
  // Pagination and search states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Debounced search

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // API Queries
  const {
    data: kategoriData,
    isLoading,
    error,
  } = useKategoriList({
    page,
    limit: 10,
    search: searchTerm,
  });

  // API Mutations
  const createKategoriMutation = useCreateKategori();
  const updateKategoriMutation = useUpdateKategori();
  const deleteKategoriMutation = useDeleteKategori();

  // Form handlers
  const resetForm = () => {
    setFormData({
      nama: "",
      deskripsi: "",
    });
  };

  const handleCreateOpen = () => {
    resetForm();
    setCreateModalOpen(true);
  };

  const handleEditOpen = (kategori) => {
    setSelectedKategori(kategori);
    setFormData({
      nama: kategori.nama,
      deskripsi: kategori.deskripsi || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteOpen = (kategori) => {
    setSelectedKategori(kategori);
    setDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createKategoriMutation.mutateAsync({
        nama: formData.nama,
        deskripsi: formData.deskripsi || undefined,
      });
      setCreateModalOpen(false);
      resetForm();
    } catch (error) {
      // Error toast handled by mutation
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateKategoriMutation.mutateAsync({
        id: selectedKategori.id,
        data: {
          nama: formData.nama,
          deskripsi: formData.deskripsi || undefined,
        },
      });
      setEditModalOpen(false);
      setSelectedKategori(null);
      resetForm();
    } catch (error) {
      // Error toast handled by mutation
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteKategoriMutation.mutateAsync(selectedKategori.id);
      setDeleteModalOpen(false);
      setSelectedKategori(null);
    } catch (error) {
      // Error toast handled by mutation
    }
  };

  // Extract data
  const kategoriList = kategoriData?.data || [];
  const pagination = kategoriData?.pagination;

  return (
    <div className="p-6">
      <Card>
        <CardContent>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">Daftar Kategori</h3>
              <button
                onClick={handleCreateOpen}
                className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm hover:bg-gray-50"
              >
                <FiPlus />
              </button>
            </div>

            <div className="relative">
              <input
                placeholder="Cari kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md shadow-sm border w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Nama Kategori
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Deskripsi
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Jumlah Barang
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-red-600">
                      Error: {error.response?.data?.message || error.message}
                    </td>
                  </tr>
                ) : !kategoriList?.length ? (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-gray-500">
                      {searchTerm
                        ? "Tidak ada kategori yang ditemukan"
                        : "Belum ada data kategori"}
                    </td>
                  </tr>
                ) : (
                  kategoriList.map((kategori) => (
                    <tr key={kategori.id} className="hover:bg-gray-50">
                      <td className="p-3 max-w-xs">
                        <div
                          className="font-medium text-gray-900 truncate"
                          title={kategori.nama}
                        >
                          {kategori.nama}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {kategori.id}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {kategori.deskripsi || (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {kategori._count?.daftar_barang || 0}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditOpen(kategori)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md"
                            title="Edit kategori"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOpen(kategori)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                            title="Hapus kategori"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <KategoriPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              currentCount={kategoriList.length}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="nama">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama"
                placeholder="Contoh: Elektronik"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
                disabled={createKategoriMutation.isPending}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi kategori..."
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                disabled={createKategoriMutation.isPending}
                className="mt-1"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
                disabled={createKategoriMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={createKategoriMutation.isPending}>
                {createKategoriMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-nama">
                Nama Kategori <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-nama"
                placeholder="Contoh: Elektronik"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
                disabled={updateKategoriMutation.isPending}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="edit-deskripsi">Deskripsi (Opsional)</Label>
              <Textarea
                id="edit-deskripsi"
                placeholder="Deskripsi kategori..."
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                disabled={updateKategoriMutation.isPending}
                className="mt-1"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedKategori(null);
                  resetForm();
                }}
                disabled={updateKategoriMutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={updateKategoriMutation.isPending}>
                {updateKategoriMutation.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedKategori && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Hapus Kategori
              </h3>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedKategori(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                disabled={deleteKategoriMutation.isPending}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">
                    Apakah Anda yakin ingin menghapus kategori ini?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>{selectedKategori.nama}</strong>
                  </p>
                </div>
              </div>

              {selectedKategori._count?.daftar_barang > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Tidak dapat menghapus:</strong> Kategori ini
                    memiliki{" "}
                    <strong>
                      {selectedKategori._count.daftar_barang} barang
                    </strong>
                    . Silakan pindahkan atau hapus barang terlebih dahulu.
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-red-700">
                    <strong>Perhatian:</strong> Tindakan ini tidak dapat
                    dibatalkan.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setSelectedKategori(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={deleteKategoriMutation.isPending}
                >
                  Batal
                </button>
                {selectedKategori._count?.daftar_barang === 0 && (
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteKategoriMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteKategoriMutation.isPending
                      ? "Menghapus..."
                      : "Hapus"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
