import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function GlobalErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
      <div className="max-w-md text-center">
        <div className="text-9xl font-bold text-[#01747b]">500</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Terjadi Kesalahan Pada Sistem</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Tim Kami sedang menanganinya. Silahkan coba beberapa saat lagi</p>
        <Button
          onClick={() => navigate(0)}
          className="mt-6 bg-[#006166] text-white hover:bg-[#005257]"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
