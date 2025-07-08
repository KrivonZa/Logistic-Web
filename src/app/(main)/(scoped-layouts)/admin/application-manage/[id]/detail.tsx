"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import { useApplication } from "@/hooks/useApplication";
import { viewApplicationDetail } from "@/stores/applicationManager/thunk";
import { useAppDispatch } from "@/stores";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";

import ApplicationAction from "@/components/layout/ApplicationAction";

const ApplicationDetail = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, applicationDetail } = useApplication();
  const applicationID = params?.id as string;

  const reload = () => {
    dispatch(viewApplicationDetail(applicationID));
  };

  useEffect(() => {
    if (applicationID) {
      reload();
    }
  }, [applicationID]);

  const formatDate = (dateString: string | null) =>
    dateString
      ? new Date(dateString).toLocaleString("vi-VN", {
          dateStyle: "short",
          timeStyle: "short",
          hour12: false,
        })
      : "(Không có)";

  if (loading || !applicationDetail) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const {
    sender,
    admin,
    createdAt,
    reviewedAt,
    senderNote,
    senderFileUrl,
    adminNote,
    adminFileUrl,
    status,
    type,
  } = applicationDetail;

  const statusLabel: Record<string, string> = {
    PENDING: "Chờ xử lý",
    APPROVED: "Đã chấp thuận",
    REJECTED: "Đã từ chối",
  };

  const typeLabel: Record<string, string> = {
    REQUEST_BECOME_COMPANY: "Yêu cầu trở thành công ty",
    OTHER: "Khác",
  };

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto py-10 px-4 space-y-6"
    >
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push("/admin/application-manage")}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trở về danh sách
        </Button>
        <h1 className="text-xl font-semibold ml-2">Chi tiết đơn ứng tuyển</h1>
      </div>

      {/* Người gửi */}
      <Card>
        <CardHeader>
          <CardTitle>Người gửi</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            <AvatarImage src={sender.avatar || ""} />
            <AvatarFallback>{sender.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-base">{sender.fullName}</div>
            <div className="text-sm text-muted-foreground">{sender.email}</div>
            <Badge className="mt-1 capitalize" variant="outline">
              {sender.role.toLowerCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Chi tiết đơn */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết đơn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-medium">Loại đơn:</span>{" "}
            {typeLabel[type] || type}
          </div>
          <div>
            <span className="font-medium">Trạng thái:</span>{" "}
            <Badge
              variant={
                status === "PENDING"
                  ? "secondary"
                  : status === "APPROVED"
                  ? "default"
                  : "destructive"
              }
              className="capitalize"
            >
              {statusLabel[status] || status}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Ngày gửi:</span>{" "}
            {formatDate(createdAt)}
          </div>
          {reviewedAt && (
            <div>
              <span className="font-medium">Ngày xử lý:</span>{" "}
              {formatDate(reviewedAt)}
            </div>
          )}
          <div>
            <span className="font-medium">Ghi chú người gửi:</span>{" "}
            {senderNote || "(Không có)"}
          </div>
          {senderFileUrl && (
            <div>
              <span className="font-medium">File đính kèm:</span>{" "}
              <a
                href={senderFileUrl}
                target="_blank"
                className="text-blue-600 underline"
              >
                Xem file
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Người xử lý (admin) */}
      {admin && (
        <Card>
          <CardHeader>
            <CardTitle>Người xử lý</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarImage src={admin.avatar || ""} />
              <AvatarFallback>{admin.fullName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-base">{admin.fullName}</div>
              <div className="text-sm text-muted-foreground">{admin.email}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ghi chú admin */}
      {adminNote && (
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú từ Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>{adminNote}</div>
            {adminFileUrl && (
              <div>
                <span className="font-medium">File đính kèm:</span>{" "}
                <a
                  href={adminFileUrl}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  Xem file
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action xử lý */}
      {["PENDING", "APPROVED", "REJECTED"].includes(status) && (
        <ApplicationAction
          applicationID={applicationID}
          status={status as "PENDING" | "APPROVED" | "REJECTED"}
          applicationType={applicationDetail.type}
          fullName={sender.fullName}
          onReload={reload}
        />
      )}
    </motion.div>
  );
};

export default isAuth(ApplicationDetail, ["Admin"]);
