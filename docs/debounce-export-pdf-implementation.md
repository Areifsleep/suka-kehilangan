# Implementasi Debounce Search & Export PDF

## Overview

Telah diimplementasikan:

1. **Debounce Search Input** - Mengurangi API calls dengan delay 500ms setelah user selesai mengetik
2. **Export PDF** - Generate laporan PDF dengan header resmi UIN Sunan Kalijaga dari backend

---

## 1. Debounce Search Implementation

### Frontend Hook

**File**: `frontend/src/hooks/useDebounce.js`

Custom hook untuk debounce value dengan delay yang bisa dikonfigurasi (default 500ms).

```javascript
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### Penggunaan di AuditReportsPage

```javascript
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearchTerm = useDebounce(searchTerm, 500);

// Query menggunakan debounced value
const { data, isLoading } = useQuery({
  queryKey: ["auditReports", page, debouncedSearchTerm, ...],
  queryFn: () => auditReportsApi.getAuditReports(params),
});
```

**Benefits**:

- Mengurangi jumlah API calls
- Meningkatkan performa aplikasi
- Menghemat bandwidth dan load server
- User experience lebih baik (tidak lag saat mengetik)

---

## 2. Export PDF Implementation

### Backend - PDF Generator Service

**File**: `backend/src/common/services/pdf-generator.service.ts`

Service untuk generate PDF dengan:

- **Header Resmi** sesuai format UIN Sunan Kalijaga
- **Tabel Data** dengan pagination otomatis
- **Summary/Ringkasan** statistik
- **Footer** dengan nomor halaman

#### Header PDF

```
┌──────────────────────────────────────────────────┐
│  [LOGO]  KEMENTERIAN AGAMA REPUBLIK INDONESIA    │
│          UNIVERSITAS ISLAM NEGERI                │
│          SUNAN KALIJAGA                          │
│                                                  │
│  Jl. Marsda Adisucipto - Telp. (0274) 512474... │
│  http://www.uin-suka.ac.id  Yogyakarta 55281    │
│  ══════════════════════════════════════════     │
└──────────────────────────────────────────────────┘
```

**Logo UIN Sunan Kalijaga:**

- Posisi: Kiri atas (50, 45)
- Ukuran: 60x60 pixels
- Source: https://lpm.uin-suka.ac.id/media/dokumen_akademik/011_20211205_UIN%20Sunan%20Kalijaga.png
- Auto-download saat generate PDF
- Fallback: Continue tanpa logo jika download gagal

#### Features:

- ✅ Auto page break untuk data yang banyak
- ✅ Zebra striping untuk readability
- ✅ Header tabel di setiap halaman baru
- ✅ Summary statistics di akhir dokumen
- ✅ Footer dengan informasi halaman
- ✅ Support filtering sama seperti view

### Backend - DTO

**File**: `backend/src/management/dto/audit.dto.ts`

```typescript
export class ExportAuditReportsDto {
  search?: string;
  status?: ReportStatus;
  categoryId?: string;
  dateRange?: string;
  reportType?: ReportType;
}
```

### Backend - Controller Endpoint

**File**: `backend/src/management/management.controller.ts`

```typescript
@Get('audit-reports/export')
async exportAuditReports(
  @Query() queryDto: ExportAuditReportsDto,
  @Res() res: Response,
) {
  const result = await this.managementService.exportAuditReportsToPDF(...);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${result.filename}"`,
  });

  res.send(buffer);
}
```

**Endpoint**: `GET /api/v1/management/audit-reports/export`

**Query Parameters** (semua optional):

- `search` - Pencarian text
- `status` - Filter status (OPEN, CLAIMED, CLOSED)
- `categoryId` - Filter kategori
- `dateRange` - Filter tanggal (today, week, month, all)
- `reportType` - Filter tipe (FOUND, LOST)

### Backend - Service Method

**File**: `backend/src/management/management.service.ts`

```typescript
async exportAuditReportsToPDF(queryDto, requestingUserId) {
  await this.validateAdminAccess(requestingUserId);

  const { buffer, filename } =
    await this.pdfGenerator.generateAuditReportPDF(queryDto);

  return {
    buffer: buffer.toString('base64'),
    filename,
    contentType: 'application/pdf',
  };
}
```

### Frontend - API Service

**File**: `frontend/src/features/admin-management/api/auditReportsApi.js`

```javascript
exportAuditReports: async (params) => {
  const response = await api.get("/management/audit-reports/export", {
    params,
    responseType: "blob", // Important untuk PDF
  });
  return response;
};
```

### Frontend - Export Handler

**File**: `frontend/src/features/admin-management/pages/AuditReportsPage.jsx`

```javascript
const handleExport = async () => {
  try {
    setIsExporting(true);
    toast.info("Memproses export PDF...");

    const response = await auditReportsApi.exportAuditReports(params);

    // Extract filename dari header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "laporan-audit.pdf";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+)"/i);
      if (match) filename = match[1];
    }

    // Create blob dan download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);

    toast.success("Laporan PDF berhasil diunduh!");
  } catch (error) {
    toast.error("Gagal mengexport laporan.");
  } finally {
    setIsExporting(false);
  }
};
```

---

## Package Dependencies

### Backend

Install dengan:

```bash
cd backend
npm install pdfkit
npm install --save-dev @types/pdfkit
```

Package:

- `pdfkit` - PDF generation library
- `@types/pdfkit` - TypeScript definitions

### Frontend

Tidak ada package tambahan (menggunakan existing packages).

---

## Struktur PDF yang Dihasilkan

### 1. Header (Setiap Halaman)

```
┌────────────────────────────────────────────┐
│ [LOGO]  KEMENTERIAN AGAMA REPUBLIK         │
│         INDONESIA                          │
│         UNIVERSITAS ISLAM NEGERI           │
│         SUNAN KALIJAGA                     │
│                                            │
│  Jl. Marsda Adisucipto - Telp. ...        │
│  http://www.uin-suka.ac.id  Yogyakarta... │
│  ══════════════════════════════════════   │
└────────────────────────────────────────────┘
```

Logo UIN (60x60px) ditampilkan di kiri atas header.

### 2. Judul & Info

```
LAPORAN AUDIT BARANG HILANG DAN DITEMUKAN
Periode: [dateRange]
Tanggal Cetak: [current date]
```

### 3. Tabel Data

| No  | Tanggal | Nama Barang | Kategori | Status | Pelapor | Lokasi |
| --- | ------- | ----------- | -------- | ------ | ------- | ------ |
| 1   | ...     | ...         | ...      | ...    | ...     | ...    |

Features:

- Header dengan background abu-abu
- Zebra striping (baris ganjil/genap berbeda warna)
- Auto truncate text yang terlalu panjang
- Auto page break dan repeat header

### 4. Ringkasan

```
Ringkasan:
Total Laporan: X
Barang Ditemukan: X
Barang Hilang: X
Status Terbuka: X
Status Diklaim: X
Status Selesai: X
```

### 5. Footer (Setiap Halaman)

```
─────────────────────────────────────────
Halaman X dari Y
Dokumen ini dihasilkan secara otomatis...
```

---

## User Flow

### Debounce Search

1. User mengetik di search input
2. Hook `useDebounce` menunggu 500ms
3. Jika user berhenti mengetik > 500ms, baru hit API
4. Jika user masih mengetik, timer di-reset
5. Loading indicator muncul saat fetching data

### Export PDF

1. User klik tombol "Export PDF"
2. Button berubah menjadi "Memproses..." dengan loading state
3. Frontend hit endpoint export dengan filter yang sama
4. Backend generate PDF dengan pdfkit
5. Backend return PDF sebagai blob
6. Frontend create download link otomatis
7. Browser download file dengan nama auto-generated
8. Toast notification muncul (success/error)
9. Button kembali normal

---

## Testing Checklist

### Debounce Search

- [ ] Ketik text di search input
- [ ] Verifikasi API call tidak langsung terjadi
- [ ] Tunggu 500ms, verifikasi API call terjadi
- [ ] Ketik lagi sebelum 500ms, verifikasi timer di-reset
- [ ] Network tab menunjukkan reduced API calls

### Export PDF

- [ ] Klik tombol "Export PDF" tanpa filter
- [ ] PDF terdownload dengan semua data
- [ ] Klik dengan filter status (OPEN)
- [ ] PDF hanya berisi data dengan status OPEN
- [ ] Klik dengan search text
- [ ] PDF hanya berisi data yang match search
- [ ] Klik dengan filter tanggal (today)
- [ ] PDF hanya berisi data hari ini
- [ ] Test dengan data > 1 halaman
- [ ] Verifikasi pagination dan header repeat
- [ ] Verifikasi summary statistics benar
- [ ] Verifikasi header UIN Sunan Kalijaga muncul
- [ ] Verifikasi footer dengan page numbers

---

## Error Handling

### Frontend

- Loading state saat export
- Disable button saat processing
- Toast notification untuk feedback
- Cleanup blob URL setelah download

### Backend

- Validation dengan DTO
- Admin access check
- Error handling di PDF generation
- Proper content-type headers

---

## Performance Considerations

### Debounce

- **Benefit**: Mengurangi 80-90% API calls
- **Trade-off**: Delay 500ms (acceptable)
- **Improvement**: User masih bisa adjust delay jika perlu

### PDF Export

- **Consideration**: Large dataset bisa slow
- **Solution**: Filter data sebelum export
- **Alternative**: Bisa tambah limit maksimal rows
- **Streaming**: Bisa improve dengan streaming untuk dataset besar

---

## Future Improvements

### Export

- [ ] Export to Excel/CSV
- [ ] Email PDF langsung dari sistem
- [ ] Schedule automated reports
- [ ] Custom date range picker
- [ ] Preview PDF sebelum download

### Search

- [ ] Advanced search dengan multiple criteria
- [ ] Save search filters
- [ ] Search history
- [ ] Auto-suggest dari historical searches

---

## Troubleshooting

### PDF tidak terdownload

- Check browser console untuk errors
- Verify backend endpoint accessible
- Check user has admin permission
- Verify pdfkit installed di backend

### Debounce tidak bekerja

- Verify useDebounce hook imported correctly
- Check React version compatibility
- Verify cleanup function di useEffect

### PDF kosong

- Check filter parameters
- Verify data exists dengan filter tersebut
- Check database connection
- Verify Prisma query syntax
