import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiKey,
  FiFilter,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  CreatePetugasModal,
  EditUserModal,
  DeleteUserModal,
  ResetPasswordModal,
} from "@/components/management";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import {
  usePetugas,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetPassword,
  useRoles,
} from "@/hooks/api/management";

export default function ManagementPetugas() {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Debounced search
  const [lokasiPosFilter, setLokasiPosFilter] = useState("");

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
    data: petugasData,
    isLoading,
    error,
    refetch,
  } = usePetugas({
    page,
    limit: 20,
    search: searchTerm,
    lokasiPos: lokasiPosFilter || undefined,
  });

  const { data: roles } = useRoles();

  // API Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();

  // Modal handlers
  const handleCreatePetugas = () => {
    setCreateModalOpen(true);
  };

  const handleEditPetugas = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeletePetugas = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setResetPasswordModalOpen(true);
  };

  // Submit handlers
  const handleCreateSubmit = async (userData) => {
    try {
      // Automatically assign PETUGAS role
      const petugasRole = roles?.find(
        (role) => role.name.toLowerCase() === "petugas"
      );
      if (!petugasRole) {
        toast.error("Role PETUGAS tidak ditemukan");
        return;
      }

      const petugasDataWithRole = {
        ...userData,
        roleId: petugasRole.id,
      };

      await createUserMutation.mutateAsync(petugasDataWithRole);
      toast.success("Petugas berhasil dibuat");
      setCreateModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat petugas");
    }
  };

  const handleEditSubmit = async (userData) => {
    try {
      await updateUserMutation.mutateAsync(userData);
      toast.success("Data petugas berhasil diupdate");
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal mengupdate data petugas"
      );
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      toast.success("Petugas berhasil dihapus");
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus petugas");
    }
  };

  const handleResetPasswordSubmit = async (passwordData) => {
    try {
      await resetPasswordMutation.mutateAsync(passwordData);
      toast.success("Password petugas berhasil direset");
      setResetPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mereset password");
    }
  };

  // Handle filter change
  const handleLokasiPosFilterChange = (value) => {
    setLokasiPosFilter(value);
    setPage(1);
  };

  // Handle API error
  if (error) {
    return (
      <>
        <HeaderDashboard title="Manajemen Petugas" />
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Error: {error.response?.data?.message || error.message}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <HeaderDashboard title="Manajemen Petugas" />
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">Daftar Petugas</h3>
              <button
                onClick={handleCreatePetugas}
                className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm hover:bg-gray-50"
              >
                <FiPlus />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Lokasi Pos Filter */}
              <div className="flex items-center gap-2">
                {/* <FiFilter className="text-gray-400" /> */}
                <select
                  value={lokasiPosFilter}
                  onChange={(e) => handleLokasiPosFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Semua Lokasi</option>
                  <option value="POS_BARAT">Pos Barat</option>
                  <option value="POS_TIMUR">Pos Timur</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  placeholder="Cari petugas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md shadow-sm border w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Nama
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Email
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Username
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Lokasi Pos
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : !petugasData?.data?.length ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      {searchTerm || lokasiPosFilter
                        ? "Tidak ada petugas yang ditemukan"
                        : "Belum ada data petugas"}
                    </td>
                  </tr>
                ) : (
                  petugasData.data.map((petugas) => (
                    <tr key={petugas.id} className="hover:bg-gray-50">
                      <td className="p-3 max-w-xs">
                        <div
                          className="font-medium text-gray-900 truncate"
                          title={petugas.profile?.full_name}
                        >
                          {petugas.profile?.full_name &&
                          petugas.profile.full_name.length > 20
                            ? `${petugas.profile.full_name.substring(0, 20)}...`
                            : petugas.profile?.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {petugas.id}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {petugas.profile?.email}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {petugas.username}
                      </td>
                      <td className="p-3">
                        {petugas.profile?.lokasi_pos ? (
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              petugas.profile.lokasi_pos === "POS_BARAT"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {petugas.profile.lokasi_pos === "POS_BARAT"
                              ? "Pos Barat"
                              : "Pos Timur"}
                          </span>
                        ) : (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            Belum ditentukan
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditPetugas(petugas)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md"
                            title="Edit petugas"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(petugas)}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-md"
                            title="Reset password"
                          >
                            <FiKey className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePetugas(petugas)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                            title="Hapus petugas"
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
          {petugasData?.pagination && (
            <div className="mt-4">
              <Pagination
                currentPage={petugasData.pagination.page}
                totalPages={petugasData.pagination.totalPages}
                hasNext={petugasData.pagination.hasNext}
                hasPrev={petugasData.pagination.hasPrev}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Petugas Modal */}
      <CreatePetugasModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createUserMutation.isPending}
      />

      {/* Edit Petugas Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditSubmit}
        loading={updateUserMutation.isPending}
        user={selectedUser}
      />

      {/* Delete Petugas Modal */}
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteUserMutation.isPending}
        user={selectedUser}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordModalOpen}
        onClose={() => {
          setResetPasswordModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleResetPasswordSubmit}
        loading={resetPasswordMutation.isPending}
        user={selectedUser}
      />
    </>
  );
}
