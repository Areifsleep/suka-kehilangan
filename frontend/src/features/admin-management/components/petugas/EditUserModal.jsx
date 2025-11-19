import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useRoles, useStudyPrograms } from "@/features/admin-management/mutations/adminManagementMutations";

export const EditUserModal = ({ isOpen, onClose, onSubmit, loading, user }) => {
  const [formData, setFormData] = useState({
    username: "",
    roleId: "",
    email: "",
    fullName: "",
    nim: "",
    studyProgramId: "",
    lokasiPos: "",
  });

  const { data: roles } = useRoles();
  const { data: studyPrograms } = useStudyPrograms();

  // Initialize form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username || "",
        roleId: user.role_id || "",
        email: user.profile?.email || "",
        fullName: user.profile?.full_name || "",
        nim: user.profile?.nim || "",
        studyProgramId: user.profile?.study_program_id || "",
        lokasiPos: user.profile?.lokasi_pos || "",
      });
    }
  }, [user, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        username: "",
        roleId: "",
        email: "",
        fullName: "",
        nim: "",
        studyProgramId: "",
        lokasiPos: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only send changed fields
    const changedData = {};

    if (formData.username !== user?.username) {
      changedData.username = formData.username;
    }
    if (formData.roleId !== user?.role_id) {
      changedData.roleId = formData.roleId;
    }
    if (formData.email !== user?.profile?.email) {
      changedData.email = formData.email;
    }
    if (formData.fullName !== user?.profile?.full_name) {
      changedData.fullName = formData.fullName;
    }
    if (formData.nim !== (user?.profile?.nim || "")) {
      changedData.nim = formData.nim || undefined;
    }

    if (formData.studyProgramId !== (user?.profile?.study_program_id || "")) {
      changedData.studyProgramId = formData.studyProgramId || undefined;
    }
    if (formData.lokasiPos !== (user?.profile?.lokasi_pos || "")) {
      changedData.lokasiPos = formData.lokasiPos || undefined;
    }

    // Only submit if there are changes
    if (Object.keys(changedData).length > 0) {
      onSubmit({
        id: user.id,
        ...changedData,
      });
    } else {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Check if selected role is petugas to show lokasi_pos field
  const selectedRole = roles?.find((role) => role.id === formData.roleId);
  const isPetugas = selectedRole?.name?.toLowerCase() === "petugas";
  const isMahasiswa = selectedRole?.name?.toLowerCase() === "mahasiswa";

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 space-y-4"
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Masukkan username"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Pilih role</option>
              {roles?.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Masukkan email"
            />
          </div>

          {/* NIM - Only for mahasiswa */}
          {isMahasiswa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                pattern="[0-9]*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan NIM"
              />
            </div>
          )}

          {/* Study Program - Only for mahasiswa */}
          {isMahasiswa && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
              <select
                name="studyProgramId"
                value={formData.studyProgramId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Pilih program studi</option>
                {studyPrograms?.map((program) => (
                  <option
                    key={program.id}
                    value={program.id}
                  >
                    {program.name} ({program.faculty.abbreviation})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lokasi Pos - Only for petugas */}
          {isPetugas && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Pos</label>
              <select
                name="lokasiPos"
                value={formData.lokasiPos}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Pilih lokasi pos</option>
                <option value="POS_BARAT">Pos Barat</option>
                <option value="POS_TIMUR">Pos Timur</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
