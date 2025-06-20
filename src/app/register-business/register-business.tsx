"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

import { useAppDispatch } from "@/stores";
import { useBank } from "@/hooks/useBank";
import { bankList } from "@/stores/bankManager/thunk";
import { uploadFile } from "@/stores/fileManager/thunk";
import { useFile } from "@/hooks/useFile";
import { registerBusiness } from "@/stores/authentManager/thunk";
import { useAuth } from "@/hooks/useAuth";
import { BusinessRegister } from "@/types/account";

const formSchema = z
  .object({
    companyName: z.string().min(2, "Tên doanh nghiệp tối thiểu 2 ký tự"),
    taxCode: z.string().min(10, "Mã số thuế không hợp lệ"),
    legalRep: z.string().min(2, "Vui lòng nhập tên người đại diện"),
    email: z.string().email("Email không hợp lệ"),
    phoneNumber: z.string().min(8, "Số điện thoại không hợp lệ"),
    address: z.string().min(5, "Địa chỉ quá ngắn"),
    bankName: z.string().min(1, "Vui lòng chọn ngân hàng"),
    bankAccount: z.string().min(12, "Số tài khoản không hợp lệ"),
    license: z
      .instanceof(File, { message: "Vui lòng tải lên giấy phép" })
      .refine((file) => file.size > 0, {
        message: "Tệp không được để trống",
      }),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const FormError = ({ message }: { message?: string }) =>
  message ? <p className="text-red-500 text-sm mt-1">{message}</p> : null;

const RegisterBusiness = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { bank } = useBank();
  const { loading: loadingFile } = useFile();
  const { loading: loadingAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    dispatch(bankList());
  }, []);

  const selectedBankName = watch("bankName");
  const selectedBank = bank.find((b) => b.code === selectedBankName);

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, license, ...rest } = data;

    try {
      const uploadRes = await dispatch(uploadFile(license)).unwrap();

      const licenseUrl = uploadRes?.data;

      const payload: BusinessRegister = {
        ...rest,
        fullName: rest.companyName,
        bankName: selectedBank?.name ?? "",
        license: licenseUrl,
      };

      await dispatch(registerBusiness(payload)).unwrap();

      setTimeout(() => {
        router.push("/login");
      }, 10000);
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen flex sm:items-center justify-center sm:py-8 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-primary to-secondary"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-5%] w-64 h-64 bg-white/15 rotate-45 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-white/20 rounded-xl rotate-12 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/5 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      </div>

      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg w-full max-w-5xl p-8 pt-20 space-y-6">
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="inline">Quay lại</span>
          </Button>
        </div>

        <div className="flex justify-center mb-4">
          <Image
            src="/logo/blue_logo_small.png"
            alt="Flipship Blue Logo"
            width={200}
            height={100}
          />
        </div>

        <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-800 mb-2 mt-8 sm:mt-0">
          Đăng ký doanh nghiệp
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Tên doanh nghiệp</Label>
              <Input
                {...register("companyName")}
                placeholder="Công ty TNHH ABC"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.companyName?.message} />
            </div>

            <div>
              <Label>Mã số thuế</Label>
              <Input
                {...register("taxCode")}
                placeholder="0123456789"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.taxCode?.message} />
            </div>

            <div>
              <Label>Người đại diện pháp luật</Label>
              <Input
                {...register("legalRep")}
                placeholder="Nguyễn Văn A"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.legalRep?.message} />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                {...register("email")}
                placeholder="contact@abc.com"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.email?.message} />
            </div>

            <div>
              <Label>Số điện thoại</Label>
              <Input
                type="tel"
                {...register("phoneNumber")}
                placeholder="0912xxxxxx"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.phoneNumber?.message} />
            </div>

            <div>
              <Label>Địa chỉ trụ sở</Label>
              <Textarea
                {...register("address")}
                placeholder="123 Đường ABC, Quận X, TP.HCM"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.address?.message} />
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankSelect">Ngân hàng</Label>
                <div className="relative flex items-center">
                  <select
                    id="bankSelect"
                    {...register("bankName")}
                    className="bg-white w-full rounded-md border pr-12 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      -- Chọn ngân hàng --
                    </option>
                    {bank.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  {selectedBank && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image
                        src={selectedBank.logo}
                        alt={selectedBank.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>
                <FormError message={errors.bankName?.message} />
              </div>

              <div>
                <Label>Số tài khoản ngân hàng</Label>
                <Input
                  {...register("bankAccount")}
                  placeholder="0123456789"
                  className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
                />
                <FormError message={errors.bankAccount?.message} />
              </div>
            </div>

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <Label>Mật khẩu</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="********"
                    className="bg-white w-full pr-10 rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <FormError message={errors.password?.message} />
              </div>

              <div>
                <Label>Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    placeholder="********"
                    className="bg-white w-full pr-10 rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <FormError message={errors.confirmPassword?.message} />
              </div>
            </div>

            <div className="md:col-span-2">
              <Label>Giấy phép kinh doanh vận tải</Label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="license-upload"
                  className="px-2 py-1 bg-primary text-white rounded cursor-pointer hover:bg-primary/90"
                >
                  Chọn tệp
                </label>
                <span className="text-sm text-gray-600">
                  {watch("license")?.name || "Chưa có tệp nào được chọn"}
                </span>
              </div>

              <input
                id="license-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("license", file);
                }}
                className="hidden"
              />

              <FormError message={errors.license?.message} />
            </div>

            <div>
              <Label>Ghi chú</Label>
              <Textarea
                {...register("address")}
                placeholder="Ghi chú cho đơn"
                className="bg-white w-full rounded-lg border-2 border-indigo-200 focus:border-primary focus:ring-4 focus:ring-indigo-200/50 transition-all duration-300 outline-none"
              />
              <FormError message={errors.address?.message} />
            </div>
          </div>

          <Button
            size="lg"
            type="submit"
            className="relative overflow-hidden w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-primary via-primary to-secondary text-white font-semibold shadow-lg group transition-all duration-300 [&_svg]:size-6"
            disabled={loadingAuth || loadingFile}
          >
            {loadingAuth || loadingFile ? (
              <Spinner size={"medium"} className="text-white" />
            ) : (
              <div>
                <span className="flex items-center justify-center relative z-10">
                  Đăng ký
                </span>
                <span className="absolute inset-y-0 right-0 w-0 bg-gradient-to-r from-secondary via-primary to-primary z-0 transition-all duration-300 ease-in-out group-hover:w-full" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default RegisterBusiness;
