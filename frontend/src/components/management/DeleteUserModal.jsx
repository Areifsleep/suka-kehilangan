import React from "react";
import { FiX, FiAlertTriangle, FiEye, FiEyeOff } from "react-icons/fi";

export const DeleteUserModal = ({ isOpen, onClose, onConfirm, loading, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Hapus User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <FiAlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900">Apakah Anda yakin ingin menghapus user ini?</p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>{user.profile?.full_name || user.username}</strong>
              </p>
              <p className="text-sm text-gray-500">{user.profile?.email}</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-sm text-red-700">
              <strong>Perhatian:</strong> Tindakan ini tidak dapat dibatalkan. Semua data yang terkait dengan user ini akan dihapus secara permanen.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
