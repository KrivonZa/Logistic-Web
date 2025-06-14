"use client";

import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "./firebase-app";

export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

export { onMessage };
