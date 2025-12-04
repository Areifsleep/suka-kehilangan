import React, { useState } from "react";
import { FiPlus, FiUpload, FiCheck, FiAlertCircle } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";

export default function ReportPage() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    lostDate: "",
    lostTime: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    additionalInfo: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const categories = ["Pilih Kategori", "Elektronik", "Tas & Dompet", "Kunci", "Pakaian", "Perhiasan", "Dokumen", "Alat Tulis", "Lainnya"];

  const locations = [
    "Pilih Lokasi",
    "Masjid UIN",
    "Fakultas Teknik",
    "Fakultas Ekonomi",
    "Fakultas Hukum",
    "Perpustakaan Pusat",
    "Kantin Pusat",
    "Auditorium Utama",
    "Parkiran Utama",
    "Asrama",
    "Lainnya",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 3) {
      alert("Maksimal 3 foto yang dapat diunggah");
      return;
    }

    // Simulate file upload
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.id !== imageId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.itemName || !formData.category || !formData.location || !formData.lostDate) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          itemName: "",
          category: "",
          description: "",
          location: "",
          lostDate: "",
          lostTime: "",
          contactName: "",
          contactPhone: "",
          contactEmail: "",
          additionalInfo: "",
          images: [],
        });
        setSubmitSuccess(false);
      }, 3000);
    }, 2000);
  };

  if (submitSuccess) {
    return (
      <div className="space-y-6">
        <HeaderDashboard title="Laporkan Kehilangan" />

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-2xl text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Laporan Berhasil Dikirim!</h3>
            <p className="text-green-700 mb-6">
              Terima kasih telah melaporkan kehilangan. Tim kami akan segera memproses laporan Anda dan menghubungi jika ada perkembangan.
            </p>
            <p className="text-sm text-green-600">Nomor Laporan: #LH{Date.now().toString().slice(-6)}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderDashboard
        title="Laporkan Kehilangan"
        subtitle="Laporkan barang yang hilang untuk membantu proses pencarian"
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Informasi Barang</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Contoh: Dompet kulit coklat"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                >
                  {categories.map((cat) => (
                    <option
                      key={cat}
                      value={cat}
                      disabled={cat === "Pilih Kategori"}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Detail</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Deskripsikan barang dengan detail (warna, ukuran, merek, ciri khusus, dll.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Time */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Lokasi dan Waktu Kehilangan</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Kehilangan <span className="text-red-500">*</span>
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                >
                  {locations.map((loc) => (
                    <option
                      key={loc}
                      value={loc}
                      disabled={loc === "Pilih Lokasi"}
                    >
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Kehilangan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="lostDate"
                  value={formData.lostDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Perkiraan Waktu</label>
                <input
                  type="time"
                  name="lostTime"
                  value={formData.lostTime}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Informasi Tambahan Lokasi</label>
                <input
                  type="text"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  placeholder="Contoh: Dekat toilet lantai 2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Informasi Kontak</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap Anda"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Upload */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Foto Barang (Opsional)</h3>
            <p className="text-sm text-gray-600 mb-4">Unggah foto barang untuk membantu proses identifikasi. Maksimal 3 foto.</p>

            <div className="space-y-4">
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative group"
                    >
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length < 3 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="text-2xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Klik untuk unggah</span> atau seret foto ke sini
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG hingga 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Warning Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Penting!</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Pastikan informasi yang Anda berikan akurat dan lengkap</li>
                  <li>• Kami akan menghubungi Anda jika ada perkembangan terkait laporan ini</li>
                  <li>• Laporan palsu dapat dikenakan sanksi sesuai peraturan yang berlaku</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors duration-200 font-medium"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mengirim Laporan...
              </>
            ) : (
              <>
                <FiPlus />
                Kirim Laporan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
