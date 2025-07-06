"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasAccess } from "@/utils/auth";
import type { ComponentType, JSX } from "react";

export default function isAuth<P extends JSX.IntrinsicAttributes>(
  Component: ComponentType<P>,
  allowedRoles: string[] = []
) {
  const IsAuth = (props: P) => {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      if (!hasAccess(allowedRoles)) {
        router.replace("/");
      } else {
        setAuthorized(true);
      }
    }, [allowedRoles, router]);

    if (!authorized) return null;

    return <Component {...props} />;
  };

  IsAuth.displayName = `WithAuth(${
    Component.displayName || Component.name || "Component"
  })`;

  return IsAuth;
}
