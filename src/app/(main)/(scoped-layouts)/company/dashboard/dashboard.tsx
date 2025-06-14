"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

// Dữ liệu doanh thu hàng tháng
const monthlyRevenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 14000 },
  { month: "Apr", revenue: 18000 },
  { month: "May", revenue: 20000 },
  { month: "Jun", revenue: 22000 },
  { month: "Jul", revenue: 21000 },
  { month: "Aug", revenue: 23000 },
  { month: "Sep", revenue: 25000 },
  { month: "Oct", revenue: 27000 },
  { month: "Nov", revenue: 30000 },
  { month: "Dec", revenue: 32000 },
];

// Dữ liệu doanh thu theo tài xế
const driverRevenueData = [
  { driver: "Anh Tài", revenue: 10000 },
  { driver: "Bình", revenue: 8000 },
  { driver: "Châu", revenue: 9500 },
  { driver: "Dũng", revenue: 12000 },
  { driver: "Em", revenue: 11000 },
];

// Dữ liệu danh sách tài xế
const allDrivers = [
  {
    name: "Anh Tài",
    revenue: 10000,
    trips: 120,
    rating: 4.7,
    lastActive: "2025-06-01",
  },
  {
    name: "Bình",
    revenue: 8000,
    trips: 100,
    rating: 4.5,
    lastActive: "2025-06-02",
  },
  {
    name: "Châu",
    revenue: 9500,
    trips: 110,
    rating: 4.6,
    lastActive: "2025-06-03",
  },
  {
    name: "Dũng",
    revenue: 12000,
    trips: 130,
    rating: 4.8,
    lastActive: "2025-06-01",
  },
  {
    name: "Em",
    revenue: 11000,
    trips: 125,
    rating: 4.7,
    lastActive: "2025-06-02",
  },
  // Thêm nhiều tài xế khác nếu cần
];

// Màu sắc cho biểu đồ Pie
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allDrivers.length / itemsPerPage);
  const currentDrivers = allDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen p-8 bg-white dark:bg-gray-900"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Thống kê doanh thu
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Biểu đồ doanh thu hàng tháng */}
        <div>
          <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
            Doanh thu hàng tháng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={monthlyRevenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  value.toLocaleString("vi-VN") + "₫"
                }
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Doanh thu (₫)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ doanh thu theo tài xế */}
        <div>
          <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
            Doanh thu từng tài xế
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={driverRevenueData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="driver" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  value.toLocaleString("vi-VN") + "₫"
                }
              />
              <Legend />
              <Bar dataKey="revenue" fill="#f97316" name="Doanh thu (₫)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ tỷ lệ đóng góp doanh thu */}
      <div className="mt-12">
        <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
          Tỷ lệ đóng góp doanh thu
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={driverRevenueData}
              dataKey="revenue"
              nameKey="driver"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {driverRevenueData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                value.toLocaleString("vi-VN") + "₫"
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Danh sách tài xế dạng card có phân trang */}
      <div className="w-full max-w-6xl mt-12">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Danh sách tài xế
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentDrivers.map((driver, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-4">
                <CardTitle className="text-base font-semibold mb-2">
                  {driver.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Doanh thu: {driver.revenue.toLocaleString("vi-VN")} VND
                </p>
                <p className="text-sm text-muted-foreground">
                  Số chuyến: {driver.trips}
                </p>
                <p className="text-sm text-muted-foreground">
                  Đánh giá: ⭐ {driver.rating}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hoạt động gần nhất: {driver.lastActive}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Điều khiển phân trang */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default isAuth(Dashboard, ["Company"]);
