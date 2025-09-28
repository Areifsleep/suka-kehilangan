# Scrollbar Layout Shift Prevention

## Masalah yang Diselesaikan

Aplikasi mengalami pergeseran layout (layout shift) saat scrollbar muncul atau hilang. Ini terjadi ketika content bertambah panjang sehingga scrollbar muncul, atau sebaliknya.

## Solusi yang Diterapkan

### 1. CSS Global (`src/styles/global.css`)

- **`html { scrollbar-gutter: stable; }`** - Mereserve space untuk scrollbar di level root
- **`body { overflow-y: scroll; }`** - Memastikan vertical scrollbar selalu ada
- **Utility classes baru:**
  - `.scrollbar-gutter-stable` - Reserve space untuk scrollbar
  - `.scrollbar-gutter-both` - Reserve space di kedua sisi
  - `.prevent-shift` - Kombinasi untuk mencegah layout shift
  - `.overflow-y-scroll-gutter` - Scrollable container dengan space reservation

### 2. Layout Components

- **BaseLayout**: Ditambahkan `prevent-shift` dan `scrollbar-gutter-stable`
- **AdminSettings**: Container utama menggunakan `scrollbar-gutter-stable`
- **Select Component**: Dropdown content menggunakan `scrollbar-gutter-stable`

### 3. Browser Support

- **Modern browsers**: Menggunakan `scrollbar-gutter: stable` (Chrome 94+, Firefox 97+)
- **Fallback**: `overflow-y: scroll` untuk browser lama

## Cara Menggunakan

### Untuk Container yang Scrollable

```jsx
<div className="h-64 overflow-y-auto scrollbar-gutter-stable">{/* Content */}</div>
```

### Untuk Mencegah Layout Shift

```jsx
<div className="prevent-shift">{/* Content yang mungkin berubah tinggi */}</div>
```

### Untuk Container Utama

```jsx
<main className="prevent-shift">
  <div className="max-w-7xl mx-auto scrollbar-gutter-stable">{/* Page content */}</div>
</main>
```

## Testing

Gunakan komponen `ScrollbarDemo` untuk testing:

```jsx
import { ScrollbarDemo } from "@/components/ScrollbarDemo";

// Di dalam component atau page
<ScrollbarDemo />;
```

## Notes

- Solusi ini bekerja di semua modern browsers
- Tidak mempengaruhi performa
- Scrollbar space dialokasikan bahkan ketika tidak dibutuhkan (by design)
- Untuk mobile/responsive, space allocation minimal karena mobile scrollbar biasanya overlay
