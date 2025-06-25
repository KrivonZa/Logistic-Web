"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { FileText, FileX, FileSpreadsheet } from "lucide-react";

const allNotifications = [
  {
    id: 1,
    title: "Đơn đăng ký tài xế mới",
    sender: "Company",
    date: "03/06/2025",
    file: "driver_info.docx",
    type: "doc",
    category: "Yêu cầu",
  },
  {
    id: 2,
    title: "Yêu cầu cập nhật thông tin công ty",
    sender: "Admin",
    date: "01/06/2025",
    file: "company_update.pdf",
    type: "pdf",
    category: "Yêu cầu",
  },
  {
    id: 3,
    title: "Báo cáo tháng 5",
    sender: "Admin",
    date: "27/05/2025",
    file: "report_may.xlsx",
    type: "xlsx",
    category: "Báo cáo",
  },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: i + 5,
    title: `Thông báo hệ thống ${i + 1}`,
    sender: "Admin",
    date: `0${(i % 9) + 1}/05/2025`,
    file: null,
    type: "text",
    category: "Thông báo",
  })),
];

const itemsPerPage = 10;
const categories = ["Tất cả", "Thông báo", "Yêu cầu", "Báo cáo"];

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileX className="w-5 h-5 text-red-600" />;
    case "doc":
      return <FileX className="w-5 h-5 text-blue-600" />;
    case "xlsx":
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
}

export default function NotificationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("Tất cả");

  const filtered = allNotifications.filter(
    (n) => filterCategory === "Tất cả" || n.category === filterCategory
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  function getBadgeColorClass(category: string) {
    switch (category) {
      case "Thông báo":
        return "bg-blue-100 text-blue-800";
      case "Yêu cầu":
        return "bg-yellow-100 text-yellow-800";
      case "Báo cáo":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Danh sách thông báo</h1>

        <Select
          onValueChange={(value) => {
            setFilterCategory(value);
            setCurrentPage(1);
          }}
          defaultValue="Tất cả"
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Lọc theo loại" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {paginated.map((n) => (
          <Card
            key={n.id}
            className="hover:border hover:border-primary duration-150"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 flex-1">
                <div className="font-medium text-lg flex items-center gap-2 flex-wrap">
                  {n.title}
                  <Badge
                    variant="outline"
                    className={getBadgeColorClass(n.category)}
                  >
                    {n.category}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1 sm:mt-0">
                  {n.sender} • {n.date}
                </div>
              </div>

              {n.file && (
                <a
                  href={`#${n.file}`}
                  className="text-blue-600 text-sm hover:underline flex items-center gap-1 whitespace-nowrap mt-2 sm:mt-0"
                >
                  {getFileIcon(n.type)}
                  {n.file}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handleChangePage(currentPage - 1)}
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => handleChangePage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handleChangePage(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
