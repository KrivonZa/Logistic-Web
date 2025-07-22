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
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useEffect } from "react";
import { useAppDispatch } from "@/stores";
import { useDashboard } from "@/hooks/useDashboard";
import { adminDashboard } from "@/stores/dashboard/thunk";
import CountUp from "react-countup";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { loading, admin } = useDashboard();

  useEffect(() => {
    dispatch(adminDashboard());
  }, []);

  if (loading) return <div className="p-8">Đang tải...</div>;
  if (!admin) return <div className="p-8">Không có dữ liệu</div>;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen p-4 md:p-8 bg-white dark:bg-gray-900"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Thống kê hệ thống
      </h2>

      {/* Tổng quan */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">
          Tổng quan
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng số công ty
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={admin.totalCompanies} duration={1.2} />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng số tài xế
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={admin.totalDrivers} duration={1.2} />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng đơn hàng
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={admin.totalDeliveryOrders} duration={1.2} />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng doanh thu
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp
                  end={admin.totalRevenue}
                  duration={1.2}
                  separator=","
                  suffix="₫"
                />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng đánh giá
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={admin.totalRatings} duration={1.2} />
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Tổng đơn đăng ký
              </CardTitle>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                <CountUp end={admin.totalApplications} duration={1.2} />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top doanh thu theo công ty */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Top 5 công ty có doanh thu cao nhất
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={admin.topCompaniesByRevenue || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="companyName"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `${value.toLocaleString("vi-VN")}₫`
                }
              />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#4F46E5" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top số đơn hàng theo công ty */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Top 5 công ty có số đơn hàng nhiều nhất
        </h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={admin.topCompaniesByDeliveryCount || []}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="companyName"
                angle={-20}
                textAnchor="end"
                interval={0}
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orderCount" fill="#10B981" name="Số đơn hàng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Danh sách doanh thu theo công ty */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Danh sách doanh thu theo công ty
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admin.companyRevenues.map((company, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <CardTitle className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {company.companyName}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Doanh thu:{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {company.totalRevenue.toLocaleString("vi-VN")}₫
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          Điểm đánh giá trung bình
        </h3>
        <div className="text-3xl font-bold text-yellow-500">
          <CountUp
            end={admin.averageRating}
            duration={1.2}
            decimals={1}
            suffix="/5"
          />
        </div>
      </div>

      {/* 3 đánh giá gần nhất */}
      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-white">
          3 đánh giá gần nhất
        </h3>
        <div className="space-y-4">
          {admin.latestRatings.map((rating) => (
            <div
              key={rating.ratingID}
              className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {rating.fullName}
                </span>
                <span className="text-yellow-500 font-bold">
                  {rating.stars} ★
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {rating.content}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(rating.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default isAuth(Dashboard, ["Admin"]);
