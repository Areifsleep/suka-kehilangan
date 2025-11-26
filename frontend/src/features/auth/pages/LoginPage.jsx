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
            {/* Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 lg:items-center">
              {/* Logo - Shows on top for mobile, right side for desktop */}
              <div className="flex flex-col items-center mb-6 lg:mb-0">
                <img
                  src={UIN}
                  alt="UIN Sunan Kalijaga Logo"
                  className="mb-4 lg:mb-0 object-contain w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64"
                />
                <h1
                  className="text-2xl sm:text-3xl font-serif text-yellow-600 tracking-wide font-bold text-center mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  SUKA KEHILANGAN
                </h1>
                <p className="text-sm text-gray-600 mb-6 text-center lg:max-w-md">
                  Merasa kehilangan? Hubungi <b>Suka Kehilangan</b>
                  <br />
                  Temukan barang Anda di sini.
                </p>
              </div>

              {/* Form Section - Shows below logo on mobile, left side on desktop */}
              <div>
                <LoginForm />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} UIN Sunan Kalijaga. Hak cipta dilindungi.</div>
      </div>
    </div>
  );
}
