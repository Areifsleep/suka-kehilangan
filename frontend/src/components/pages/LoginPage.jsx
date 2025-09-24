import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import UIN from "@/assets/UIN.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();    
    console.log({ username, password });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[420px] sm:max-w-md md:max-w-lg lg:max-w-xl">
        <div className="flex flex-col items-center mb-6">
          {UIN}
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
            >
              <rect width="100%" height="100%" fill="transparent" />
              <g transform="translate(50,18)">
                <path d="M50 0 L90 0 Q100 0 100 10 L100 50 Q100 60 90 60 L50 60 Q40 60 40 50 L40 10 Q40 0 50 0 Z" fill="#0b6b44" />
                <circle cx="50" cy="80" r="8" fill="#c9a360" />
              </g>
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-3xl font-serif text-yellow-600 tracking-wide">SUKA KEHILANGAN</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2 text-center max-w-xs">
            Merasa Kehilangan Hubungi Suka Kehilangan
            <br /> Temukan Barang Anda Di Sini
          </p>
        </div>

        <Card className="bg-transparent shadow-none">
          <CardContent className="bg-transparent p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="sr-only">Username</Label>
                <Input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm px-4 py-3 text-sm sm:text-base"
                />
              </div>

              <div className="relative">
                <Label className="sr-only">Password</Label>
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm pr-10 px-4 py-3 text-sm sm:text-base"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label="toggle password"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >                  
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.054.165-2.069.471-3.019" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  )}
                </button>

                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Lupa Password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full rounded-lg py-3 font-semibold border-2 border-gray-300 bg-white text-gray-700 transition-all duration-150 ease-in-out hover:bg-green-500 hover:border-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  LOGIN
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2025 UIN Sunan Kalijaga. All rights reserved
        </div>
      </div>
    </div>
  );
}