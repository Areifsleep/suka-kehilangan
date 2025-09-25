import { useRouteError, Link } from "react-router";

// Anda bisa menambahkan ikon dari library seperti react-icons jika mau
import { VscError } from "react-icons/vsc";

export default function GlobalErrorPage() {
  // Hook ini akan menangkap objek error yang terjadi
  const error = useRouteError();

  // Di lingkungan produksi, kirim error ke layanan monitoring
  if (import.meta.env.PROD) {
    // Ganti dengan layanan monitoring Anda, contoh: Sentry, LogRocket, dll.
    // Sentry.captureException(error);
    console.error("Error di produksi:", error); // Fallback jika monitoring tidak ada
  } else {
    // Di development, cukup log ke konsol untuk debugging
    console.error("Terjadi error pada route:", error);
  }

  // Menentukan pesan error yang akan ditampilkan ke pengguna
  let status = error.status || 500;
  let statusText = "Terjadi Kesalahan";
  let message = "Maaf, terjadi masalah pada sistem kami. Tim kami sudah diberitahu dan sedang menanganinya.";

  // Khusus untuk error 404 (Not Found), berikan pesan yang lebih spesifik
  if (error.status === 404) {
    statusText = "Halaman Tidak Ditemukan";
    message = "Maaf, kami tidak dapat menemukan halaman yang Anda cari.";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#343a40",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "20px",
      }}
    >
      <VscError
        size={80}
        color="#dc3545"
      />
      <h1
        style={{
          fontSize: "5rem",
          margin: "0",
          color: "#6c757d",
        }}
      >
        {status}
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          margin: "10px 0",
          fontWeight: "600",
        }}
      >
        {statusText}
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "600px",
          margin: "20px 0",
        }}
      >
        {message}
      </p>
      <Link
        to="/"
        style={{
          marginTop: "30px",
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          fontWeight: "bold",
          transition: "background-color 0.2s",
        }}
        // Hover effect dengan JavaScript
        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
