"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import isAuth from "@/components/isAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Settings = () => {
  const [browserNotificationPermission, setBrowserNotificationPermission] =
    useState<NotificationPermission>("default");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if ("Notification" in window) {
      const currentPermission = Notification.permission;
      setBrowserNotificationPermission(currentPermission);
      setIsNotificationsEnabled(currentPermission === "granted");

      const savedState = localStorage.getItem("notifications-enabled");

      if (savedState === "true" && currentPermission === "granted") {
        setIsNotificationsEnabled(true);
      } else {
        setIsNotificationsEnabled(false);
      }
    }
  }, []);

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked) {
      const result = await Notification.requestPermission();
      setBrowserNotificationPermission(result);

      if (result === "granted") {
        setIsNotificationsEnabled(true);
        localStorage.setItem("notifications-enabled", "true");
        new Notification("Thông báo đã được bật", {
          body: "Bạn sẽ nhận thông báo từ hệ thống.",
          icon: "/logo/white_logo_small.png",
        });
        const audio = new Audio("/notification.mp3");
        audio.play();
        toast.success(
          "Thông báo đã được bật. Bạn sẽ nhận các thông báo mới từ hệ thống."
        );
      } else {
        setIsNotificationsEnabled(false);
        localStorage.setItem("notifications-enabled", "false");
        toast.error(
          "Bạn đã từ chối quyền thông báo. Vui lòng bật thủ công trong cài đặt trình duyệt nếu muốn nhận thông báo."
        );
      }
    } else {
      setIsNotificationsEnabled(false);
      localStorage.setItem("notifications-enabled", "false");
      setBrowserNotificationPermission("denied");
      toast.warning(
        "Thông báo đã được tắt trong ứng dụng. Nếu bạn vẫn nhận được thông báo, vui lòng tắt chúng trong cài đặt trình duyệt."
      );
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-12 max-w-screen-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold">Cài đặt</h2>

      <Accordion type="multiple" className="w-full space-y-4">
        <Card className="shadow-sm">
          <AccordionItem value="notifications" className="border-b-0">
            <CardHeader className="p-0">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                Cài đặt Thông báo
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent className="px-6 pb-6 pt-0 mt-0">
              <p className="text-muted-foreground mb-4">
                Quản lý các thiết lập liên quan đến thông báo của ứng dụng.
              </p>
              <Separator className="my-4" />

              <div className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 rounded-lg">
                <div className="flex-1">
                  <Label
                    htmlFor="notification-toggle"
                    className="text-base font-medium"
                  >
                    Bật thông báo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo từ hệ thống qua trình duyệt của bạn.
                  </p>
                </div>
                <Switch
                  id="notification-toggle"
                  checked={isNotificationsEnabled}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                *Trạng thái quyền trình duyệt:{" "}
                <span className="font-semibold text-foreground">
                  {browserNotificationPermission === "granted"
                    ? "Đã cấp quyền"
                    : browserNotificationPermission === "denied"
                    ? "Đã từ chối"
                    : "Chưa cấp quyền"}
                </span>
                . Để thay đổi hoàn toàn quyền thông báo, vui lòng truy cập cài
                đặt của trình duyệt bạn đang sử dụng.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>

        <Card className="shadow-sm">
          <AccordionItem value="profile-settings" className="border-b-0">
            <CardHeader className="p-0">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                Hồ sơ cá nhân
              </AccordionTrigger>
            </CardHeader>
            <AccordionContent className="px-6 pb-6 pt-0 mt-0">
              <p className="text-muted-foreground mb-4">
                Chỉnh sửa thông tin cá nhân của bạn như ảnh đại diện, tên người
                dùng, và thông tin liên hệ.
              </p>
              <Separator className="my-4" />{" "}
              <div className="flex flex-col gap-2">
                {" "}
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  onClick={() => {
                    console.log("Chuyển hướng đến trang chỉnh sửa hồ sơ");
                    router.push("/profile");
                  }}
                >
                  <span className="font-normal">Hồ sơ cá nhân</span>{" "}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />{" "}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  onClick={() => {
                    router.push("/changePassword");
                  }}
                >
                  <span className="font-normal">Thay đổi mật khẩu</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                *Lưu ý: Một số chức năng đang trong quá trình phát triển và sẽ
                sớm được cập nhật.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </motion.div>
  );
};

export default isAuth(Settings, ["Admin", "Staff", "Company", "Coordinator"]);
