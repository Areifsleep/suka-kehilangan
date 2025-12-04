import React, { useState } from "react";
import { useNavigate } from "react-router";
import { FiUpload, FiX, FiMapPin, FiUser, FiPhone, FiMail, FiCalendar } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/features/auth/contexts/AuthContext";

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

const formSchema = z.object({
  itemName: z.string().min(3, "Nama barang harus minimal 3 karakter").max(50, "Nama barang maksimal 50 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  description: z.string().min(10, "Deskripsi harus minimal 10 karakter").max(500, "Deskripsi maksimal 500 karakter"),
  location: z.string().min(1, "Lokasi harus dipilih"),
  specificLocation: z.string().optional(),
  lostDate: z.string().min(1, "Tanggal kehilangan harus diisi"),
  lostTime: z.string().optional(),
  reporterName: z.string().min(2, "Nama harus minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  reporterPhone: z
    .string()
    .min(10, "Nomor telepon harus minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9+\-\s()]*$/, "Nomor telepon hanya boleh mengandung angka dan karakter khusus (+, -, spasi, tanda kurung)"),
  reporterEmail: z.string().email("Format email tidak valid").min(1),
  additionalNotes: z.string().max(300, "Catatan tambahan maksimal 300 karakter").optional(),
});

export default function LaporKehilanganPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(user);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      category: "",
      description: "",
      location: "",
      specificLocation: "",
      lostDate: "",
      lostTime: "",
      reporterName: user?.full_name || "",
      reporterPhone: "",
      reporterEmail: user?.email || "",
      additionalNotes: "",
    },
  });

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

  const handleSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Include selected images in the data
      const submitData = {
        ...data,
        images: selectedImages,
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Laporan kehilangan berhasil dikirim!");

      // Show submitted data for demonstration
      console.log("Submitted data:", submitData);

      navigate("/user");
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div>
        <form
          id="lapor-kehilangan-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiUpload className="w-5 h-5 text-green-600" />
                </div>
                Informasi Barang
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="itemName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="item-name">
                          Nama Barang <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="item-name"
                          type="text"
                          placeholder="Contoh: Dompet kulit coklat"
                          aria-invalid={fieldState.invalid}
                          className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="category">
                          Kategori <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="category"
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white"
                          >
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
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Deskripsi Barang <span className="text-red-500">*</span>
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="description"
                          placeholder="Jelaskan ciri-ciri barang secara detail (warna, merek, ukuran, dll.)"
                          rows={6}
                          className="border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white min-h-[120px] transition-all duration-200 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">{field.value?.length || 0}/500 karakter</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>Berikan deskripsi yang detail untuk membantu proses identifikasi barang.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

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
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                </div>
                Lokasi & Waktu Kehilangan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="location"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="location">
                          Lokasi Umum <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            id="location"
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white"
                          >
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
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="specificLocation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="specific-location">Lokasi Spesifik</FieldLabel>
                        <Input
                          {...field}
                          id="specific-location"
                          type="text"
                          placeholder="Contoh: Lantai 2, dekat tangga"
                          className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                        <FieldDescription>Berikan detail lokasi yang lebih spesifik jika memungkinkan.</FieldDescription>
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="lostDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lost-date">
                          Tanggal Kehilangan <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            id="lost-date"
                            type="date"
                            aria-invalid={fieldState.invalid}
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="lostTime"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lost-time">Perkiraan Waktu</FieldLabel>
                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            id="lost-time"
                            type="time"
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                          />
                        </div>
                        <FieldDescription>Perkiraan waktu ketika barang hilang (opsional).</FieldDescription>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="reporterName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-name">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            id="reporter-name"
                            type="text"
                            placeholder="Nama lengkap Anda"
                            aria-invalid={fieldState.invalid}
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="reporterPhone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-phone">
                          Nomor Telepon <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            {...field}
                            id="reporter-phone"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                            aria-invalid={fieldState.invalid}
                            className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="reporterEmail"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reporter-email">Email</FieldLabel>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          {...field}
                          id="reporter-email"
                          type="email"
                          placeholder="email@example.com"
                          aria-invalid={fieldState.invalid}
                          className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 pl-12 pr-4 text-base bg-gray-50 focus:bg-white transition-all duration-200"
                        />
                      </div>
                      <FieldDescription>Email akan digunakan untuk notifikasi jika barang ditemukan.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="additionalNotes"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="additional-notes">Catatan Tambahan</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="additional-notes"
                          placeholder="Informasi tambahan yang mungkin membantu proses pencarian..."
                          rows={4}
                          className="border-2 border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl py-3 px-4 text-base bg-gray-50 focus:bg-white min-h-[100px] transition-all duration-200 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">{field.value?.length || 0}/300 karakter</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>Tambahkan informasi yang mungkin membantu dalam proses pencarian barang.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <Field
              orientation="horizontal"
              className="justify-end"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  navigate("/user");
                }}
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Batal
              </Button>
              <Button
                type="submit"
                form="lapor-kehilangan-form"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white min-w-[160px] px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </Button>
            </Field>
          </div>
        </form>
      </div>
    </div>
  );
}
