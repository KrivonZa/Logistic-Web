"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import isAuth from "@/components/isAuth";
import { useState } from "react";

const ChangePassword = () => {
  const [step, setStep] = useState(1);

  const [phone, setPhone] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const totalSteps = 3;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.match(/^\d{9,11}$/)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }
    setError("");
    setMessage(`Mã xác nhận đã được gửi đến số ${phone}`);
    setStep(2);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode !== "123456") {
      setError("Mã xác nhận không đúng");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setError("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    setError("");
    setMessage("Mật khẩu đã được thay đổi thành công!");
  };

  const progressValue = (step / totalSteps) * 100;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center px-4 py-10 sm:py-12 sm:px-6 lg:px-8 min-h-screen bg-gray-50"
    >
      <h1 className="text-2xl sm:text-3xl text-primary font-bold mb-6 text-center">
        Thay đổi mật khẩu
      </h1>

      <div className="w-full max-w-md mb-6">
        <Progress value={progressValue} className="h-2 rounded-full" />
        <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-600 font-medium">
          <span className={step === 1 ? "text-primary font-semibold" : ""}>
            Nhập số điện thoại
          </span>
          <span className={step === 2 ? "text-primary font-semibold" : ""}>
            Nhập mã xác nhận
          </span>
          <span className={step === 3 ? "text-primary font-semibold" : ""}>
            Đổi mật khẩu
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow space-y-6">
        {message && (
          <p className="text-center text-green-600 font-medium">{message}</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Nhập số điện thoại"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Gửi mã xác nhận
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetCode">Mã xác nhận</Label>
              <Input
                type="text"
                id="resetCode"
                name="resetCode"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                required
                placeholder="Nhập mã xác nhận"
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Xác nhận mã
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmitPassword} className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-center text-primary">
              Đổi mật khẩu
            </h2>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <Input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full">
              Cập nhật mật khẩu
            </Button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default isAuth(ChangePassword, [
  "Admin",
  "Staff",
  "Company",
  "Coordinator",
]);
