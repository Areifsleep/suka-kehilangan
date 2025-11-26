# Audit Reports Feature Implementation

## Overview

Fitur Audit Reports telah diimplementasikan untuk menampilkan log laporan barang (found/lost items) dengan data real dari backend.

## Backend Implementation

### 1. DTO (Data Transfer Object)

**File**: `backend/src/management/dto/audit.dto.ts`

```typescript
export class AuditReportsQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReportStatus;
  categoryId?: string;
  dateRange?: string;
  reportType?: ReportType;
}
```

### 2. Controller Endpoints

**File**: `backend/src/management/management.controller.ts`

- `GET /api/v1/management/audit-reports` - Mendapatkan daftar audit reports dengan filter
- `GET /api/v1/management/audit-stats` - Mendapatkan statistik audit
- `GET /api/v1/management/categories` - Mendapatkan daftar kategori

### 3. Service Methods

**File**: `backend/src/management/management.service.ts`

- `getAuditReports()` - Mengambil data reports dengan pagination dan filter
- `getAuditStats()` - Menghitung statistik items
- `getCategories()` - Mengambil daftar kategori

### Features:

- **Pagination**: Support page & limit
- **Search**: Cari berdasarkan nama barang, deskripsi, lokasi, nama pelapor
- **Filter**:
  - Status (OPEN, CLAIMED, CLOSED)
  - Category
  - Report Type (FOUND, LOST)
  - Date Range (today, week, month, all)
- **Statistics**: Total items, found items, lost items, claimed items, trends

## Frontend Implementation

### 1. API Service

**File**: `frontend/src/features/admin-management/api/auditReportsApi.js`

```javascript
export const auditReportsApi = {
  getAuditReports: async (params) => {...},
  getAuditStats: async () => {...},
  getCategories: async () => {...},
};
```

### 2. Page Component

**File**: `frontend/src/features/admin-management/pages/AuditReportsPage.jsx`

**Features**:

- ✅ Real-time data dari backend menggunakan React Query
- ✅ Statistics cards dengan trending data
- ✅ Search & filter functionality
- ✅ Responsive design (Desktop: Table, Mobile: Cards)
- ✅ Pagination support
- ✅ Loading states
- ✅ Empty states

**Components**:

- `StatCard` - Menampilkan statistik dengan icon dan trend
- `ItemAuditRow` - Row untuk tampilan tabel (desktop)
- `ItemAuditCard` - Card untuk tampilan mobile
- `AuditReportsPage` - Main component

### 3. React Query Integration

```javascript
// Fetch stats
useQuery({
  queryKey: ["auditStats"],
  queryFn: auditReportsApi.getAuditStats,
});

// Fetch reports
useQuery({
  queryKey: ["auditReports", page, searchTerm, filterStatus, filterCategory, dateRange],
  queryFn: () => auditReportsApi.getAuditReports(buildQueryParams()),
});
```

## Database Schema

Data diambil dari tabel:

- `reports` - Data laporan barang
- `report_categories` - Kategori barang
- `users` & `user_profiles` - Data pelapor
- `report_images` - Gambar barang

## Status Mapping

Backend → Frontend:

- `OPEN` → `open` (Terbuka - kuning)
- `CLAIMED` → `claimed` (Diklaim - biru)
- `CLOSED` → `closed` (Selesai - hijau)

## Report Type Mapping

- `FOUND` → `found` (Ditemukan - hijau)
- `LOST` → `lost` (Hilang - merah)

## Cara Penggunaan

### Backend

Endpoint sudah otomatis protected dengan JWT Guard, hanya admin yang bisa akses:

```bash
GET /api/v1/management/audit-reports?page=1&limit=20&status=OPEN&dateRange=today
GET /api/v1/management/audit-stats
GET /api/v1/management/categories
```

### Frontend

Navigasi ke halaman Audit Reports di admin dashboard. Fitur yang tersedia:

1. **Search**: Ketik nama barang, lokasi, atau nama pelapor
2. **Filter Status**: Pilih status (Semua, Terbuka, Diklaim, Selesai)
3. **Filter Kategori**: Pilih kategori barang
4. **Filter Tanggal**: Pilih rentang waktu (Hari Ini, Minggu Ini, Bulan Ini, Semua)
5. **Pagination**: Navigate antar halaman
6. **Refresh**: Reload data
7. **Export**: Export data (perlu implementasi lebih lanjut)

## Testing

1. Pastikan backend berjalan: `yarn start:dev`
2. Pastikan frontend berjalan: `yarn dev`
3. Login sebagai admin
4. Navigasi ke menu Audit Reports
5. Test search, filter, dan pagination

## Next Steps (Optional Enhancements)

- [ ] Implement export to CSV/Excel functionality
- [ ] Add detail modal untuk view complete audit info
- [ ] Add chart/graph untuk visualisasi data
- [ ] Add real-time updates menggunakan WebSocket
- [ ] Add more advanced filters (multiple categories, custom date range)
