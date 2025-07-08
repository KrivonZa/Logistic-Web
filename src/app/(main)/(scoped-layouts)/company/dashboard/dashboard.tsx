"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/stores";
import { useDashboard } from "@/hooks/useDashboard";
import { companyDashboard } from "@/stores/dashboard/thunk";
import CountUp from "react-countup";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const VIETNAMESE_STATUS: Record<string, string> = {
  pending: "Chờ xử lý",
  in_progress: "Đang giao",
  delivered: "Đã giao",
  canceled: "Đã huỷ",
  reject: "Từ chối",
  unpaid: "Chưa thanh toán",
  paid: "Đã thanh toán",
  scheduled: "Đã lên lịch",
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { loading, company } = useDashboard();

  useEffect(() => {
    dispatch(companyDashboard());
  }, []);

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (!company) return <div className="p-8">Không có dữ liệu</div>;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Thống kê doanh nghiệp
      </h2>

      {/* Tổng quan */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          Tổng quan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tổng tài xế
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={company.totalDrivers} duration={1.2} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tổng phương tiện
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={company.totalVehicles} duration={1.2} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tổng đơn
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={company.totalOrders} duration={1.2} />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tổng chuyến đi
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={company.totalTrips} duration={1.2} />
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tỉ lệ huỷ chuyến tháng này
              </CardTitle>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                <CountUp
                  end={company.percentCanceled}
                  decimals={1}
                  suffix="%"
                  duration={1.2}
                />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tỉ lệ hoàn thành chuyến
              </CardTitle>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                <CountUp
                  end={company.percentCompletedTrips}
                  decimals={1}
                  suffix="%"
                  duration={1.2}
                />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Doanh thu tháng này
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp
                  end={company.companyRevenueThisMonth}
                  duration={1.2}
                  separator=","
                  suffix="₫"
                />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col justify-center h-full">
              <CardTitle className="text-base font-semibold mb-2 text-gray-500 dark:text-gray-400">
                Tổng doanh thu
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp
                  end={company.companyTotalRevenue}
                  duration={1.2}
                  separator=","
                  suffix="₫"
                />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trạng thái đơn hàng tháng này */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Đơn hàng trong tháng theo trạng thái
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {Object.entries(company.orderStatusCountThisMonth || {}).map(
            ([status, count]) => (
              <Card key={status}>
                <CardContent className="p-4 flex flex-col justify-center h-full">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {VIETNAMESE_STATUS[status] || status}
                  </CardTitle>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                    <CountUp end={count} duration={1.2} />
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Số chuyến theo phương tiện */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Số chuyến theo phương tiện
        </h3>
        {company.vehicleTripStatsThisMonth.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.vehicleTripStatsThisMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicleNumber" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tripCount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Số chuyến theo tài xế */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Số chuyến theo tài xế
        </h3>
        {company.driverTripStatsThisMonth.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={company.driverTripStatsThisMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tripCount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Doanh thu theo tài xế */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Doanh thu theo tài xế
        </h3>
        {company.driverIncomeThisMonth.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={company.driverIncomeThisMonth}
                  dataKey="totalIncome"
                  nameKey="fullName"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {company.driverIncomeThisMonth.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value.toLocaleString("vi-VN")}₫`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top tài xế trong tháng */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Top tài xế tháng này (số chuyến nhiều nhất)
        </h3>
        {company.topDriverThisMonth.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {company.topDriverThisMonth.map((driver) => (
              <Card key={driver.driverID}>
                <CardContent className="p-4">
                  <CardTitle className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                    {driver.fullName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Số chuyến: {driver.tripCount}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default isAuth(Dashboard, ["Company"]);
