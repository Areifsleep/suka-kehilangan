import UIN from "@/assets/UIN.png";

import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-6">
            {/* Responsive Layout */}
            <div className="">
              {/* Logo - Shows on top for mobile, right side for desktop */}
              <div className="flex flex-col gap-5 items-center mb-6">
                <img
                  src={UIN}
                  alt="UIN Sunan Kalijaga Logo"
                  className="lg:mb-0 object-contain size-32"
                />
                <div>
                  <h1
                    className="text-2xl font-serif text-yellow-600 tracking-wide font-bold text-center mb-2"
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
              </div>

              {/* Form Section - Shows below logo on mobile, left side on desktop */}
              <div>
                <LoginForm />
              </div>
            </div>
          </CardContent>
          {/* Footer */}
          <div className="text-center text-xs text-gray-500">&copy; {new Date().getFullYear()} UIN Sunan Kalijaga. Hak cipta dilindungi.</div>
        </Card>
      </div>
    </div>
  );
}
