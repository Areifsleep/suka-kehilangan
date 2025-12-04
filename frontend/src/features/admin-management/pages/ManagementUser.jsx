import React, { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiKey } from "react-icons/fi";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { UsersPagination, CreateUserModal, EditUserModal, DeleteUserModal, ResetPasswordModal } from "../components";

import {
  useRegularUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResetPassword,
  useRoles,
} from "@/features/admin-management/mutations/adminManagementMutations";

export default function ManagementUser() {
  // State for filters and pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Debounced search

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
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useRegularUsers({
    page,
    limit: 20,
    search: searchTerm,
  });

  const { data: roles } = useRoles();

  // API Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();

  // Modal handlers
  const handleCreateUser = () => {
    setCreateModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
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
      // Automatically assign USER role
      const userRole = roles?.find((role) => role.name.toLowerCase() === "user");
      if (!userRole) {
        toast.error("Role USER tidak ditemukan");
        return;
      }

      const userDataWithRole = {
        ...userData,
        roleId: userRole.id,
      };

      await createUserMutation.mutateAsync(userDataWithRole);
      toast.success("User berhasil dibuat");
      setCreateModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat user");
    }
  };

  const handleEditSubmit = async (userData) => {
    try {
      await updateUserMutation.mutateAsync(userData);
      toast.success("User berhasil diupdate");
      setEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengupdate user");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      toast.success("User berhasil dihapus");
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  const handleResetPasswordSubmit = async (passwordData) => {
    try {
      await resetPasswordMutation.mutateAsync(passwordData);
      toast.success("Password berhasil direset");
      setResetPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mereset password");
    }
  };

  // Handle API error
  if (error) {
    return (
      <>
        {/* <HeaderDashboard title="Manajemen User" /> */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error.response?.data?.message || error.message}</p>
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
      {/* <HeaderDashboard title="Manajemen User" /> */}
      <Card>
        <CardContent>
          {/* Header Section: Dibuat responsif */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-medium">Daftar User</h3>
              <button
                onClick={handleCreateUser}
                className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm hover:bg-gray-50"
              >
                <FiPlus />
              </button>
            </div>

            <div className="relative">
              <input
                placeholder="Cari user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md shadow-sm border w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* --- Tampilan Desktop (Tabel) --- */}
          {/* Tetap menggunakan overflow-x-auto sebagai fallback jika ada kolom yang sangat lebar */}
          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nama</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Username</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Role</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Program Studi</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : !usersData?.data?.length ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-gray-500"
                    >
                      {searchTerm ? "Tidak ada user yang ditemukan" : "Belum ada data user"}
                    </td>
                  </tr>
                ) : (
                  usersData.data.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="p-3 max-w-xs">
                        <div
                          className="font-medium text-gray-900 truncate"
                          title={user.profile?.full_name}
                        >
                          {user.profile?.full_name}
                        </div>
                        {user.profile?.nim && <div className="text-sm text-gray-500">NIM: {user.profile.nim}</div>}
                        {user.profile?.nip && <div className="text-sm text-gray-500">NIP: {user.profile.nip}</div>}
                      </td>
                      <td className="p-3 text-sm text-gray-900">{user.profile?.email}</td>
                      <td className="p-3 text-sm text-gray-900">{user.username}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role?.name === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role?.name === "petugas"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role?.name}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {user.profile?.study_program ? (
                          <div>
                            <div className="font-medium">{user.profile.study_program.name}</div>
                            <div className="text-xs text-gray-500">{user.profile.study_program.faculty?.abbreviation}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md"
                            title="Edit user"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleResetPassword(user)}
                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-md"
                            title="Reset password"
                          >
                            <FiKey className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                            title="Hapus user"
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

          {/* --- Tampilan Mobile (Kartu) --- */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memuat data...</span>
                </div>
              </div>
            ) : !usersData?.data?.length ? (
              <div className="p-6 text-center text-gray-500">{searchTerm ? "Tidak ada user yang ditemukan" : "Belum ada data user"}</div>
            ) : (
              usersData.data.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-4 rounded-lg shadow border"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900">{user.profile?.full_name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{user.username}</div>
                      {user.profile?.nim && <div className="text-sm text-gray-500">NIM: {user.profile.nim}</div>}
                      {user.profile?.nip && <div className="text-sm text-gray-500">NIP: {user.profile.nip}</div>}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role?.name === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role?.name === "petugas"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role?.name}
                    </span>
                  </div>

                  <div className="border-t my-3"></div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="text-gray-900 truncate">{user.profile?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Prodi:</span>
                      {user.profile?.study_program ? (
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{user.profile.study_program.name}</div>
                          <div className="text-xs text-gray-500">{user.profile.study_program.faculty?.abbreviation}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  </div>

                  <div className="border-t my-3"></div>

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md"
                      title="Edit user"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-md"
                      title="Reset password"
                    >
                      <FiKey className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                      title="Hapus user"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {usersData?.pagination && (
            <div className="mt-4">
              <UsersPagination
                currentPage={usersData.pagination.page}
                totalPages={usersData.pagination.totalPages}
                hasNext={usersData.pagination.hasNext}
                hasPrev={usersData.pagination.hasPrev}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        loading={createUserMutation.isPending}
      />

      {/* Edit User Modal */}
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

      {/* Delete User Modal */}
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
