"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const totalSteps = 3;
  const progressValue = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step === 3) {
      if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
      alert("Đặt lại mật khẩu thành công");
      // Xử lý đặt lại mật khẩu ở đây
    } else if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-subtle via-neutral to-tertiary relative overflow-hidden px-4">
      {/* Background lấy cảm hứng từ Login */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-15%] right-[-5%] w-40 h-40 sm:w-64 sm:h-64 bg-white/15 rotate-45" />
        <div className="absolute top-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 bg-purple-300/20 rounded-lg rotate-12" />
        <div className="absolute bottom-1/3 left-1/5 w-16 h-16 sm:w-24 sm:h-24 bg-indigo-300/25 rounded-full" />
      </div>
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-primary"
        onClick={() => router.push("/login")}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại đăng nhập
      </Button>

      <Card className="w-full max-w-md shadow-xl relative z-10 bg-white/95 backdrop-blur-md border-none">
        <CardHeader className="px-6 pt-6">
          <Progress value={progressValue} className="h-2 mb-6 bg-gray-200" />
          <h1 className="text-2xl sm:text-3xl py-1 font-bold bg-gradient-to-r from-primary to-[#00B4D8] bg-clip-text text-transparent text-center">
            Quên mật khẩu
          </h1>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-6">
          {step === 1 && (
            <div className="space-y-4">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button className="w-full" onClick={handleNext} disabled={!phone}>
                Gửi mã xác thực
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Label htmlFor="otp">Mã xác thực</Label>
              <Input
                id="otp"
                placeholder="Nhập mã xác thực"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Quay lại
                </Button>
                <Button className="flex-1" onClick={handleNext} disabled={!otp}>
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  Quay lại
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleNext}
                  disabled={!newPassword || !confirmPassword}
                >
                  Đặt lại mật khẩu
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
