"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock, Eye, EyeOff, ChevronsRight } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex sm:items-center justify-center sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects with Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-tertiary">
        {/* Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-15%] right-[-5%] w-40 h-40 sm:w-64 sm:h-64 bg-white/15 rotate-45" />
        <div className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 bg-purple-300/20 rounded-lg rotate-12" />
        <div className="absolute bottom-1/3 left-1/5 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-300/25 rounded-full" />
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center gap-4">
        {/* Logo */}
        <Image
          src="/logo/white_logo_small.png"
          alt="Flipship White Logo"
          width={250}
          height={250}
          className="sm:block hidden"
        />
        {/* Main Card */}
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/95 backdrop-blur-md border-none shadow-2xl overflow-hidden relative z-10">
          <CardHeader className="text-center sm:text-left">
            {/* Logo for mobile screens */}
            <div className="sm:hidden flex justify-center mb-4">
              <Image
                src="/logo/blue_logo_small.png"
                alt="Flipship Blue Logo"
                width={200}
                height={100}
              />
            </div>
            <h1 className="text-3xl sm:text-4xl py-1 font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent text-center">
              Đăng nhập
            </h1>
          </CardHeader>

          <CardContent className="px-6 sm:px-8 space-y-6">
            <form className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <Label
                  size="sm"
                  htmlFor="username"
                  className="font-semibold text-gray-700"
                >
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập username"
                    className="pl-12 h-12 sm:h-14 w-full rounded-xl border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  size="sm"
                  htmlFor="password"
                  className="font-semibold text-gray-700"
                >
                  Mật khẩu
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    className="pl-12 pr-12 h-12 sm:h-14 w-full rounded-xl border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                size="lg"
                type="submit"
                className="relative overflow-hidden w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-semibold shadow-lg group transition-all duration-300 [&_svg]:size-6"
              >
                <span className="flex items-center justify-center relative z-10">
                  Đăng nhập ngay
                  <ChevronsRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-y-0 right-0 w-0 bg-gradient-to-r from-purple-500 to-tertiary z-0 transition-all duration-300 ease-in-out group-hover:w-full" />
              </Button>
            </form>

            {/* Footer Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4 sm:gap-0">
              <Link
                href="/forgot-password"
                className="text-primary hover:opacity-80 font-medium duration-150"
              >
                Quên mật khẩu?
              </Link>
              <Link href="/register-business">
                <Button
                  size="lg"
                  className="hover:opacity-80 duration-150 font-medium rounded-full px-4"
                >
                  Đăng ký doanh nghiệp
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Footer */}
      <footer className="absolute bottom-8 sm:bottom-4 z-10 flex items-center opacity-80">
        <span className="text-center text-white text-xs sm:text-base font-medium">
          Phát triển bởi
        </span>
        <Image
          src="/logo/white_logo_small.png"
          alt="Flipship White Logo Footer"
          width={120}
          height={100}
        />
      </footer>
    </div>
  );
}
