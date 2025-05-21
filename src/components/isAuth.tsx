"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasAccess } from "@/utils/auth";

export default function isAuth(Component: any, allowedRoles: string[] = []) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);


    //Kiểm tra role
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
}
