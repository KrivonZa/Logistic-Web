"use client";

import { useEffect } from "react";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { toast } from "sonner";
import { app } from "@/lib/firebase-app";

export default function FCMListener() {
  useEffect(() => {
    const setupFCM = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("🚫 Notification permission denied");
          return;
        }

        const supported = await isSupported();
        if (!supported) {
          console.warn("🚫 FCM is not supported in this browser");
          return;
        }

        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
          vapidKey:
            process.env.NEXT_PUBLIC_FIREBASE_VAPID_ID,
        });

        if (token) {
          console.log("✅ FCM Token:", token);
        }

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
      } catch (error) {
        console.error("❌ FCM setup error:", error);
      }
    };

    setupFCM();
  }, []);

  return null;
}
