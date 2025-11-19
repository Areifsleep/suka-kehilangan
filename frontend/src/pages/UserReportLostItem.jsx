import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiUpload, FiX, FiMapPin, FiUser, FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeaderDashboard } from "@/components/common";
import { toast } from "react-toastify";

const categories = ["Dompet", "Tas", "Kunci", "Handphone", "Laptop", "Buku", "Alat Tulis", "Jam Tangan", "Kacamata", "Jaket", "Lainnya"];

const locations = [
  "Masjid UIN",
  "Area Parkir",
  "Kantin",
  "Perpustakaan",
  "Ruang Kuliah",
  "Laboratorium",
  "Taman",
  "Toilet",
  "Area Olahraga",
  "Gedung Rektorat",
  "Lainnya",
];

export default function UserReportLostItem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    description: "",
    location: "",
    specificLocation: "",
    lostDate: "",
    lostTime: "",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    additionalNotes: "",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 3) {
      toast.error("Maksimal 3 gambar yang dapat diunggah");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (
      !formData.itemName ||
      !formData.category ||
      !formData.description ||
      !formData.location ||
      !formData.lostDate ||
      !formData.reporterName ||
      !formData.reporterPhone
    ) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Laporan kehilangan berhasil dikirim!");
      navigate("/user");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <HeaderDashboard title="Laporkan Kehilangan" />

      <div>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiUpload className="w-5 h-5 text-green-600" />
                </div>
                Informasi Barang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nama Barang <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Dompet kulit coklat"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange("itemName", e.target.value)}
                    className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <Select onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white">
                      <SelectValue placeholder="Pilih kategori barang" />
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
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Deskripsi Barang <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Jelaskan ciri-ciri barang secara detail (warna, merek, ukuran, dll.)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white min-h-[120px] transition-all duration-200"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Foto Barang (Opsional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-200 bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer"
                  >
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <FiUpload className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-700 font-semibold text-base mb-2">Klik untuk upload gambar atau drag & drop</p>
                    <p className="text-sm text-gray-500">Maksimal 3 gambar, format JPG/PNG, ukuran maks 5MB</p>
                  </label>
                </div>

                {/* Preview uploaded images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {selectedImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group"
                      >
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-28 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 rounded-b-xl">
                          {image.name.length > 15 ? image.name.substring(0, 15) + "..." : image.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Time Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                </div>
                Lokasi & Waktu Kehilangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Lokasi Umum <span className="text-red-500">*</span>
                  </label>
                  <Select onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem
                          key={location}
                          value={location}
                        >
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Lokasi Spesifik</label>
                  <Input
                    type="text"
                    placeholder="Contoh: Lantai 2, dekat tangga"
                    value={formData.specificLocation}
                    onChange={(e) => handleInputChange("specificLocation", e.target.value)}
                    className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Tanggal Kehilangan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="date"
                      value={formData.lostDate}
                      onChange={(e) => handleInputChange("lostDate", e.target.value)}
                      className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Perkiraan Waktu</label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="time"
                      value={formData.lostTime}
                      onChange={(e) => handleInputChange("lostTime", e.target.value)}
                      className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange("reporterName", e.target.value)}
                      className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.reporterPhone}
                      onChange={(e) => handleInputChange("reporterPhone", e.target.value)}
                      className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Email (Opsional)</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.reporterEmail}
                    onChange={(e) => handleInputChange("reporterEmail", e.target.value)}
                    className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Catatan Tambahan</label>
                <Textarea
                  placeholder="Informasi tambahan yang mungkin membantu proses pencarian..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                  className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white min-h-[100px] transition-all duration-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-6 justify-end bg-white rounded-2xl p-6 shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user")}
              className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white min-w-[160px] px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
