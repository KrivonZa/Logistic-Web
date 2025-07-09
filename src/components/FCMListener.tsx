"use client";

import { useEffect } from "react";
import { getMessaging, isSupported, onMessage } from "firebase/messaging";
// import {
//   getMessaging,
//   getToken,
//   isSupported,
//   onMessage,
// } from "firebase/messaging";
import { toast } from "sonner";
import { app } from "@/lib/firebase-app";

export default function FCMListener() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          return;
        }

        const supported = await isSupported();
        if (!supported) {
          toast.warning("Thông báo không được hỗ trợ trên trình duyệt này");
          return;
        }

        const messaging = getMessaging(app);

        // const token = await getToken(messaging, {
        //   vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_ID,
        // });

        onMessage(messaging, (payload) => {
          const title = payload?.notification?.title || "Bạn có thông báo mới";
          const body = payload?.notification?.body || "";

          toast(title, {
            description: body,
            style: {
              backgroundColor: "#005cb8",
              color: "#fff",
            },
          });

          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => {});
        });
      } catch {}
    };

    setupFCM();
  }, []);

  return null;
}
