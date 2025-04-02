import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginImage from "../../../public/login/Login.png";
import { MdArrowForward, MdPerson, MdLock } from "react-icons/md";

export const metadata: Metadata = {
  title: "Login",
  description: "Login page for Administrators and Business Management Services",
};

export default function Login() {
  return (
    <div className="flex h-screen w-full">
      {/* Nửa bên trái: Background và nút chuyển sang landing page */}
      <div className="relative w-2/3 h-full">
        <Image
          src={LoginImage}
          alt="Login Background Image"
          fill
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 flex items-center ml-36">
          <Link
            href="https://logistic-landing-page.vercel.app/"
            target="_blank"
          >
            <button className="group bg-primary flex items-center justify-center text-white px-6 py-3 rounded-full hover:bg-secondary transition">
              <span>Tìm hiểu thêm</span>
              <MdArrowForward className="ml-2 duration-200 group-hover:ml-3" />
            </button>
          </Link>
        </div>
      </div>

      {/* Nửa bên phải: Form đăng nhập */}
      <div className="w-1/3 h-full flex items-center justify-center bg-white">
        <div className="max-w-lg w-full space-y-4 p-6">
          {/* Tiêu đề */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Chào mừng quay trở lại
            </h1>
            <h2 className="text-lg text-gray-600">Đăng nhập để bắt đầu</h2>
          </div>

          {/* Form nhập liệu */}
          <form className="space-y-4">
            <div className="relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPerson className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-3 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập username"
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="mt-2 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-3 py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {/* Nút */}
            <div className="flex flex-col space-y-5">
              <button
                type="submit"
                className="w-full rounded-full bg-primary text-white py-4 hover:opacity-80 transition"
              >
                Đăng nhập
              </button>
              <Link href="/register-business">
                <button className="w-full rounded-full bg-white text-primary py-4 hover:border-secondary hover:text-secondary duration-200 transition border-2 border-primary">
                  Đăng ký với tư cách doanh nghiệp
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
