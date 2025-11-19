import UIN from "@/assets/UIN.png";

import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md lg:max-w-5xl">
        {/* Login Card */}
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-6">
            {/* Mobile Layout: Logo on top */}
            <div className="lg:hidden flex flex-col items-center mb-6">
              <img
                src={UIN}
                alt="UIN Sunan Kalijaga Logo"
                className="mb-4 object-contain w-32 h-32 sm:w-48 sm:h-48"
              />

              <h1
                className="text-2xl sm:text-3xl font-serif text-yellow-600 tracking-wide font-bold"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                SUKA KEHILANGAN
              </h1>
              <p className="text-sm text-gray-600 mt-2 text-center max-w-xs">
                Merasa kehilangan? Hubungi <b>Suka Kehilangan</b>
                <br />
                Temukan barang Anda di sini.
              </p>
            </div>

            {/* Desktop Layout: 2 Columns */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              {/* Left Column: Form */}
              <div>
                <h1
                  className="text-3xl font-serif text-yellow-600 tracking-wide font-bold mb-2 text-center"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  SUKA KEHILANGAN
                </h1>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Merasa kehilangan? Hubungi <b>Suka Kehilangan</b>
                  <br />
                  Temukan barang Anda di sini.
                </p>
                <LoginForm />
              </div>

              {/* Right Column: Logo */}
              <div className="flex items-center justify-center">
                <img
                  src={UIN}
                  alt="UIN Sunan Kalijaga Logo"
                  className="object-contain w-64 h-64"
                />
              </div>
            </div>

            {/* Mobile Form */}
            <div className="lg:hidden">
              <LoginForm />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} UIN Sunan Kalijaga. Hak cipta dilindungi.</div>
      </div>
    </div>
  );
}
