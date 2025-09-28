import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  FiUpload,
  FiX,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
} from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HeaderDashboard } from "@/components/HeaderDashboard";
import { toast } from "react-toastify";

const categories = [
  "Dompet",
  "Tas",
  "Kunci",
  "Handphone",
  "Laptop",
  "Buku",
  "Alat Tulis",
  "Jam Tangan",
  "Kacamata",
  "Jaket",
  "Lainnya",
];

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
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard
        title="Laporkan Kehilangan"
        subtitle="Laporkan barang yang hilang untuk membantu proses pencarian"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Informasi Barang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Barang <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Dompet kulit coklat"
                    value={formData.itemName}
                    onChange={(e) =>
                      handleInputChange("itemName", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Pilih kategori barang" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Barang <span className="text-red-500">*</span>
                </label>
                <Textarea
                  placeholder="Jelaskan ciri-ciri barang secara detail (warna, merek, ukuran, dll.)"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="border-gray-300 focus:ring-green-500 focus:border-green-500 min-h-[100px]"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Barang (Opsional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer">
                    <FiUpload className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      Klik untuk upload gambar atau drag & drop
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Maksimal 3 gambar, format JPG/PNG
                    </p>
                  </label>
                </div>

                {/* Preview uploaded images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location & Time Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Lokasi & Waktu Kehilangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Umum <span className="text-red-500">*</span>
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("location", value)
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi Spesifik
                  </label>
                  <Input
                    type="text"
                    placeholder="Contoh: Lantai 2, dekat tangga"
                    value={formData.specificLocation}
                    onChange={(e) =>
                      handleInputChange("specificLocation", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Kehilangan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.lostDate}
                    onChange={(e) =>
                      handleInputChange("lostDate", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Perkiraan Waktu
                  </label>
                  <Input
                    type="time"
                    value={formData.lostTime}
                    onChange={(e) =>
                      handleInputChange("lostTime", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Nama lengkap Anda"
                    value={formData.reporterName}
                    onChange={(e) =>
                      handleInputChange("reporterName", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.reporterPhone}
                    onChange={(e) =>
                      handleInputChange("reporterPhone", e.target.value)
                    }
                    className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Opsional)
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={formData.reporterEmail}
                  onChange={(e) =>
                    handleInputChange("reporterEmail", e.target.value)
                  }
                  className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan
                </label>
                <Textarea
                  placeholder="Informasi tambahan yang mungkin membantu..."
                  value={formData.additionalNotes}
                  onChange={(e) =>
                    handleInputChange("additionalNotes", e.target.value)
                  }
                  className="border-gray-300 focus:ring-green-500 focus:border-green-500 min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/user")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
            >
              {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
