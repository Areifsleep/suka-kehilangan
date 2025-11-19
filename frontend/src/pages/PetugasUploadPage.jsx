import React, { useState } from "react";
import { FiUpload, FiImage, FiTag, FiMapPin, FiCalendar, FiFileText, FiSave, FiX, FiCheck } from "react-icons/fi";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeaderDashboard } from "@/components/common/HeaderDashboard";

export default function PetugasUploadPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    location: "",
    dateFound: "",
    condition: "",
    additionalNotes: "",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const categories = ["Elektronik", "Pakaian", "Aksesoris", "Dokumen", "Kendaraan", "Tas", "Sepatu", "Buku", "Alat Tulis", "Lainnya"];

  const conditions = ["Sangat Baik", "Baik", "Cukup", "Rusak Ringan", "Rusak Berat"];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 5) {
      alert("Maksimal 5 gambar");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (imageId) => {
    setSelectedImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== imageId);
      // Clean up object URLs
      const removedImage = prev.find((img) => img.id === imageId);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview);
      }
      return updatedImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        location: "",
        dateFound: "",
        condition: "",
        additionalNotes: "",
      });
      setSelectedImages([]);

      alert("Barang berhasil diunggah!");
    } catch (error) {
      alert("Gagal mengunggah barang!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <HeaderDashboard title="Unggah Barang Temuan" />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Informasi Dasar */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiTag className="mr-2" />
              Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nama Barang *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Masukkan nama barang"
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Kategori *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
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

              <div className="md:col-span-2 space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Deskripsi *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Deskripsikan barang secara detail (warna, ukuran, merk, dll)"
                  rows={3}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lokasi dan Waktu */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiMapPin className="mr-2" />
              Lokasi dan Waktu Penemuan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Lokasi Ditemukan *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Contoh: Perpustakaan lantai 2, Gedung A"
                  required
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateFound"
                  className="text-sm font-medium text-gray-700"
                >
                  Tanggal Ditemukan *
                </Label>
                <Input
                  id="dateFound"
                  type="date"
                  value={formData.dateFound}
                  onChange={(e) => handleInputChange("dateFound", e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kondisi dan Catatan */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Kondisi dan Catatan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="condition"
                  className="text-sm font-medium text-gray-700"
                >
                  Kondisi Barang *
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleInputChange("condition", value)}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem
                        key={condition}
                        value={condition}
                      >
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="additionalNotes"
                  className="text-sm font-medium text-gray-700"
                >
                  Catatan Tambahan
                </Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  placeholder="Catatan khusus tentang barang ini"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Gambar */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiImage className="mr-2" />
              Foto Barang
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer"
                >
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk mengunggah foto atau drag & drop</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG hingga 10MB (maksimal 5 foto)</p>
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {selectedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative"
                    >
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="px-6"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={uploading}
            className="bg-green-600 hover:bg-green-700 px-6"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Mengunggah...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Unggah Barang
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
