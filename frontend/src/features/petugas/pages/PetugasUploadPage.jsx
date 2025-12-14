import React, { useState } from "react";
import { FiUpload, FiX, FiMapPin, FiUser, FiLoader } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useCreateBarangTemuan } from "@/features/petugas/mutations/useBarangTemuan";
import { usePetugasCategories } from "@/features/petugas/queries/useBarangTemuan";

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

const INDONESIAN_PHONE_REGEX = /^(?:\+62|62|0)8[0-9]{8,11}$/;

export const phoneIdSchema = z
  .string()
  .trim()
  .regex(INDONESIAN_PHONE_REGEX, "Nomor HP Indonesia tidak valid");

const formSchema = z.object({
  nama_barang: z
    .string()
    .min(3, "Nama barang harus minimal 3 karakter")
    .max(255, "Nama barang maksimal 255 karakter"),
  kategori_id: z.string().min(1, "Kategori harus dipilih"),
  deskripsi: z
    .string()
    .min(10, "Deskripsi harus minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),
  lokasi_umum: z.string().min(1, "Lokasi umum harus diisi"),
  lokasi_spesifik: z.string().optional(),
  tanggal_ditemukan: z.string().min(1, "Tanggal ditemukan harus diisi"),
  perkiraan_waktu_ditemukan: z.string().optional(),
  nama_penemu: z
    .string()
    .min(3, "Nama penemu harus minimal 3 karakter")
    .max(255, "Nama penemu maksimal 255 karakter"),
  identitas_penemu: z.string().optional(),
  nomor_hp_penemu: phoneIdSchema,
  email_penemu: z
    .string()
    .email("Format email tidak valid")
    .optional()
    .or(z.literal("")),
  catatan_penemu: z
    .string()
    .max(300, "Catatan maksimal 300 karakter")
    .optional(),
});

export default function PetugasUploadPage() {
  const { user } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // React Query hooks
  const { data: categories = [], isLoading: categoriesLoading } =
    usePetugasCategories();
  const createBarangTemuanMutation = useCreateBarangTemuan();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_barang: "",
      kategori_id: "",
      deskripsi: "",
      lokasi_umum: "",
      lokasi_spesifik: "",
      tanggal_ditemukan: "",
      perkiraan_waktu_ditemukan: "",
      nama_penemu: "",
      identitas_penemu: "",
      nomor_hp_penemu: "",
      email_penemu: "",
      catatan_penemu: "",
    },
  });

  const processFiles = (files) => {
    const fileArray = Array.from(files);

    // Filter only image files
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (imageFiles.length + selectedImages.length > 3) {
      toast.error("Maksimal 3 gambar yang dapat diunggah");
      return;
    }

    const newImages = imageFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const handleImageUpload = (e) => {
    processFiles(e.target.files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if leaving the drop area completely
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
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
    // Validate images
    if (selectedImages.length === 0) {
      toast.error("Minimal 1 foto barang harus diunggah");
      return;
    }

    try {
      // Extract files from selectedImages
      const files = selectedImages.map((img) => img.file);

      console.log("Submitting data:", data);
      console.log("Files to upload:", files);

      // Submit to backend
      await createBarangTemuanMutation.mutateAsync({
        data,
        files,
      });

      // Reset form and images on success
      form.reset();
      setSelectedImages([]);
      // Toast already handled by mutation hook
    } catch (error) {
      console.error("Error submitting form:", error);
      // Error toast already handled by mutation
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
                    name="nama_barang"
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
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="kategori_id"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="category">
                          Kategori <span className="text-red-500">*</span>
                        </FieldLabel>
                        {categoriesLoading ? (
                          <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                            <FiLoader className="w-4 h-4 animate-spin" />
                            <span className="text-muted-foreground text-sm">
                              Memuat kategori...
                            </span>
                          </div>
                        ) : (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Pilih kategori barang" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="deskripsi"
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
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value?.length || 0}/500 karakter
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Berikan deskripsi yang detail untuk membantu proses
                        identifikasi barang.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Foto Barang{" "}
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                    isDragging
                      ? "border-green-500 bg-green-100"
                      : "border-gray-300 bg-gray-50 hover:border-green-400 hover:bg-green-50/30"
                  }`}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label htmlFor="imageUpload" className="cursor-pointer block">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <FiUpload className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-gray-700 font-semibold text-base mb-2">
                      {isDragging
                        ? "Lepaskan file di sini"
                        : "Klik untuk upload gambar atau drag & drop"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Maksimal 3 gambar, format JPG/PNG, ukuran maks 5MB
                    </p>
                  </label>
                </div>

                {/* Preview uploaded images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
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
                          {image.name.length > 15
                            ? image.name.substring(0, 15) + "..."
                            : image.name}
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
                Lokasi & Waktu Penemuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="lokasi_umum"
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
                          <SelectTrigger id="location">
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
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="lokasi_spesifik"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="specific-location">
                          Lokasi Spesifik
                        </FieldLabel>
                        <Input
                          {...field}
                          id="specific-location"
                          type="text"
                          placeholder="Contoh: Lantai 2, dekat tangga"
                        />
                        <FieldDescription>
                          Berikan detail lokasi yang lebih spesifik jika
                          memungkinkan.
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="tanggal_ditemukan"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lost-date">
                          Tanggal Ditemukan{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="lost-date"
                          type="date"
                          aria-invalid={fieldState.invalid}
                          max={new Date().toISOString().split("T")[0]}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="perkiraan_waktu_ditemukan"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lost-time">
                          Perkiraan Waktu
                        </FieldLabel>
                        <Input {...field} id="lost-time" type="time" />
                        <FieldDescription>
                          Perkiraan waktu ketika barang ditemukan.
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Reporter Information */}
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-white">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                Informasi Pelapor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">Informasi pelapor:</span> Data
                  orang yang menemukan dan mengantarkan barang ini ke
                  satpam/petugas.
                </p>
              </div>

              <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="nama_penemu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-name">
                          Nama Lengkap Pelapor{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="reporter-name"
                          type="text"
                          placeholder="Contoh: Ahmad Rizki Maulana"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="identitas_penemu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-id">
                          NIM/NIP/NIK
                        </FieldLabel>
                        <Input
                          {...field}
                          id="reporter-id"
                          type="text"
                          placeholder="Contoh: 21523001 (jika mahasiswa/dosen)"
                        />
                        <FieldDescription>
                          Opsional - untuk civitas akademika UIN Sunan Kalijaga
                        </FieldDescription>
                      </Field>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Controller
                    name="nomor_hp_penemu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-phone">
                          Nomor HP Pelapor{" "}
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="reporter-phone"
                          type="tel"
                          placeholder="Contoh: 081234567890"
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldDescription>
                          Untuk konfirmasi atau pertanyaan lebih lanjut
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email_penemu"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="reporter-email">
                          Email Pelapor
                        </FieldLabel>
                        <Input
                          {...field}
                          id="reporter-email"
                          type="email"
                          placeholder="Contoh: ahmad@students.uin-suka.ac.id"
                        />
                        <FieldDescription>
                          Opsional - email untuk komunikasi
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <Controller
                  name="catatan_penemu"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reporter-notes">
                        Catatan dari Pelapor
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="reporter-notes"
                          placeholder="Contoh: Saya menemukan barang ini di bangku dekat jendela..."
                          rows={4}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value?.length || 0}/300 karakter
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Informasi tambahan dari pelapor tentang kondisi atau
                        situasi penemuan barang
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              form="lapor-kehilangan-form"
              disabled={createBarangTemuanMutation.isPending}
              size="lg"
            >
              {createBarangTemuanMutation.isPending ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin mr-2" />
                  Mengirim...
                </>
              ) : (
                "Kirim Laporan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
