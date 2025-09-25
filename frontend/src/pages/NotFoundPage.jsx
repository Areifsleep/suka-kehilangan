import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Halaman Tidak Ditemukan</h2>
      <p className="mt-2 text-center">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-[#01747b] rounded-md hover:bg-[#016a70]"
      >
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}
