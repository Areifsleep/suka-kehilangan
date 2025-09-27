export const FullPageSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center -mt-24">
        <div className="relative">
          <img
            src="/gif-pesawat.gif"
            alt="Animasi pesawat terbang"
            className="w-96 h-96 object-contain"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
            <h1 className="text-2xl font-semibold g">Sedang Memuat Aplikasi</h1>
            <p className="text-gray-600 text-base">Mohon bersabar sebentar...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
