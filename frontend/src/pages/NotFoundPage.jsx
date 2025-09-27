import { Link } from "react-router";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="max-w-md text-center">
        <div className="text-9xl font-bold text-[#01747b]">404</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Halaman Tidak Ditemukan</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Maaf, kami tidak dapat menemukan halaman yang Anda cari. Mungkin telah dipindahkan atau dihapus.
        </p>
        <Button
          asChild
          className="mt-6 bg-[#006166] text-white hover:bg-[#005257]"
        >
          <Link to="/">Kembali ke Halaman Utama</Link>
        </Button>
      </div>
    </div>
  );
}
