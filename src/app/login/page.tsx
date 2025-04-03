import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Lock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Login",
  description: "Next-level login experience for Business Management",
};

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-500 to-tertiary" />
      
      {/* Main Card */}
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/95 backdrop-blur-md border-none shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <CardHeader className="p-6 sm:p-8 pb-0">
          <div className="flex flex-col items-center sm:items-start gap-2 mb-2">
            <h1 className="text-3xl sm:text-4xl py-1 sm:py-0 font-extrabold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent text-center sm:text-left">
              Chào mừng quay trở lại
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground font-medium text-center sm:text-left">
            Đăng nhập để tiếp tục
          </p>
        </CardHeader>

        <CardContent className="px-6 sm:px-8 space-y-6">
          <form className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
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
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Mật khẩu
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="pl-12 h-12 sm:h-14 w-full rounded-xl border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-80 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Đăng nhập ngay
              <ArrowRight className="ml-2 h-5 sm:h-6 w-5 sm:w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm gap-4 sm:gap-0">
            <Link href="/forgot-password" className="text-primary hover:opacity-80 font-medium duration-150">
              Quên mật khẩu?
            </Link>
            <Link href="/register-business">
              <Button className="hover:opacity-80 duration-150 font-medium rounded-full px-4">
                Đăng ký doanh nghiệp
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
