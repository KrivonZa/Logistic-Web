"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useState } from "react";

const dummyData = [
  {
    name: "Công ty A",
    revenue: 120000,
    requests: 45,
    updateInfo: 10,
    registerBusiness: 15,
    registerDriver: 12,
    registerCoordinator: 8,
  },
  {
    name: "Công ty B",
    revenue: 85000,
    requests: 32,
    updateInfo: 8,
    registerBusiness: 10,
    registerDriver: 9,
    registerCoordinator: 5,
  },
  {
    name: "Công ty C",
    revenue: 60000,
    requests: 28,
    updateInfo: 7,
    registerBusiness: 8,
    registerDriver: 8,
    registerCoordinator: 5,
  },
  {
    name: "Công ty D",
    revenue: 50000,
    requests: 20,
    updateInfo: 5,
    registerBusiness: 6,
    registerDriver: 5,
    registerCoordinator: 4,
  },
  {
    name: "Công ty E",
    revenue: 42000,
    requests: 18,
    updateInfo: 4,
    registerBusiness: 5,
    registerDriver: 5,
    registerCoordinator: 4,
  },
  {
    name: "Công ty F",
    revenue: 39000,
    requests: 16,
    updateInfo: 4,
    registerBusiness: 4,
    registerDriver: 4,
    registerCoordinator: 4,
  },
  {
    name: "Công ty G",
    revenue: 30000,
    requests: 12,
    updateInfo: 3,
    registerBusiness: 3,
    registerDriver: 3,
    registerCoordinator: 3,
  },
  {
    name: "Công ty H",
    revenue: 26000,
    requests: 10,
    updateInfo: 2,
    registerBusiness: 3,
    registerDriver: 3,
    registerCoordinator: 2,
  },
  {
    name: "Công ty I",
    revenue: 24000,
    requests: 8,
    updateInfo: 2,
    registerBusiness: 2,
    registerDriver: 2,
    registerCoordinator: 2,
  },
  {
    name: "Công ty J",
    revenue: 22000,
    requests: 6,
    updateInfo: 1,
    registerBusiness: 2,
    registerDriver: 2,
    registerCoordinator: 1,
  },
  {
    name: "Công ty K",
    revenue: 20000,
    requests: 5,
    updateInfo: 1,
    registerBusiness: 1,
    registerDriver: 2,
    registerCoordinator: 1,
  },
  {
    name: "Công ty L",
    revenue: 18000,
    requests: 4,
    updateInfo: 1,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 1,
  },
  {
    name: "Công ty M",
    revenue: 17000,
    requests: 3,
    updateInfo: 1,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 0,
  },
  {
    name: "Công ty N",
    revenue: 16000,
    requests: 3,
    updateInfo: 1,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 0,
  },
  {
    name: "Công ty O",
    revenue: 15000,
    requests: 2,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 0,
  },
  {
    name: "Công ty P",
    revenue: 14000,
    requests: 2,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 0,
  },
  {
    name: "Công ty Q",
    revenue: 13000,
    requests: 2,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 1,
    registerCoordinator: 0,
  },
  {
    name: "Công ty R",
    revenue: 12000,
    requests: 1,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 0,
    registerCoordinator: 0,
  },
  {
    name: "Công ty S",
    revenue: 11000,
    requests: 1,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 0,
    registerCoordinator: 0,
  },
  {
    name: "Công ty T",
    revenue: 10000,
    requests: 1,
    updateInfo: 0,
    registerBusiness: 1,
    registerDriver: 0,
    registerCoordinator: 0,
  },
];

// Sample data for request type distribution (aggregated)
const requestTypeData = [
  {
    name: "Cập nhật thông tin",
    value: dummyData.reduce((sum, company) => sum + company.updateInfo, 0),
  },
  {
    name: "Đăng ký doanh nghiệp",
    value: dummyData.reduce(
      (sum, company) => sum + company.registerBusiness,
      0
    ),
  },
  {
    name: "Đăng ký tài xế",
    value: dummyData.reduce((sum, company) => sum + company.registerDriver, 0),
  },
  {
    name: "Đăng ký nhân viên điều phối",
    value: dummyData.reduce(
      (sum, company) => sum + company.registerCoordinator,
      0
    ),
  },
];

// Sample data for revenue trend over time (mock monthly data)
const revenueTrendData = [
  { month: "Tháng 1", revenue: 50000 },
  { month: "Tháng 2", revenue: 60000 },
  { month: "Tháng 3", revenue: 75000 },
  { month: "Tháng 4", revenue: 90000 },
  { month: "Tháng 5", revenue: 110000 },
  { month: "Tháng 6", revenue: 130000 },
];

// Colors for PieChart
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 10;
  const topCompanies = [...dummyData]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 20);
  const totalPages = Math.ceil(topCompanies.length / companiesPerPage);

  // Calculate the companies to display on the current page
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = topCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-8 items-center justify-center py-6 px-4 sm:px-6 lg:px-8 w-full"
    >
      {/* Revenue Bar Chart */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">
          Biểu đồ doanh thu theo công ty
        </h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCompanies}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
              <Legend />
              <Bar dataKey="revenue" fill="#4F46E5" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Types Bar Chart */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">
          Biểu đồ số lượng yêu cầu theo loại
        </h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCompanies}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="updateInfo"
                fill="#4F46E5"
                name="Cập nhật thông tin"
              />
              <Bar
                dataKey="registerBusiness"
                fill="#10B981"
                name="Đăng ký doanh nghiệp"
              />
              <Bar
                dataKey="registerDriver"
                fill="#F59E0B"
                name="Đăng ký tài xế"
              />
              <Bar
                dataKey="registerCoordinator"
                fill="#EF4444"
                name="Đăng ký nhân viên điều phối"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Request Type Distribution Pie Chart */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">Phân bố loại yêu cầu</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={requestTypeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {requestTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend Line Chart */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">
          Xu hướng doanh thu theo thời gian
        </h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueTrendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company List with Pagination */}
      <div className="w-full max-w-5xl">
        <h2 className="text-xl font-semibold mb-4">Danh sách công ty</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCompanies.map((company, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-4">
                <CardTitle className="text-base font-semibold mb-2">
                  {company.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Doanh thu: {company.revenue.toLocaleString()} VND
                </p>
                <p className="text-sm text-muted-foreground">
                  Tổng yêu cầu: {company.requests}
                </p>
                <p className="text-sm text-muted-foreground">
                  Cập nhật thông tin: {company.updateInfo}
                </p>
                <p className="text-sm text-muted-foreground">
                  Đăng ký doanh nghiệp: {company.registerBusiness}
                </p>
                <p className="text-sm text-muted-foreground">
                  Đăng ký tài xế: {company.registerDriver}
                </p>
                <p className="text-sm text-muted-foreground">
                  Đăng ký nhân viên điều phối: {company.registerCoordinator}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1
                  ? "bg-[#4F46E5] text-white"
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

export default isAuth(Dashboard, ["Admin"]);
