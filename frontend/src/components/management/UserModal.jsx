// frontend/src/components/management/UserModal.jsx
import React, { useState, useEffect } from "react";
import { FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useRoles, useStudyPrograms } from "@/hooks/api/management";

export const CreateUserModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    nim: "",
    nip: "",
    studyProgramId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { data: roles } = useRoles();
  const { data: studyPrograms } = useStudyPrograms();

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        username: "",
        password: "",
        email: "",
        fullName: "",
        nim: "",
        nip: "",
        studyProgramId: "",
      });
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Either NIM or NIP must be filled
    if (!formData.nim && !formData.nip) {
      alert("Harap isi salah satu dari NIM atau NIP");
      return;
    }

    // Clean up empty strings to undefined for optional fields
    const cleanedData = {
      ...formData,
      nim: formData.nim || undefined,
      nip: formData.nip || undefined,
      studyProgramId: formData.studyProgramId || undefined,
    };

    onSubmit(cleanedData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Tambah User Baru</h3>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4 text-gray-400" /> : <FiEye className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
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

          {/* NIM and NIP - At least one must be filled */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIM <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 block">(Isi salah satu: NIM atau NIP)</span>
              </label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 block">(Isi salah satu: NIM atau NIP)</span>
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan NIP"
              />
            </div>
          </div>

          {/* Program Studi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi *</label>
            <select
              name="studyProgramId"
              value={formData.studyProgramId}
              onChange={handleChange}
              required
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
