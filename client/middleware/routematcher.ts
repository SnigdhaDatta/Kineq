"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/signup",
  "/about",
  "/privacy",
  "/terms",
  "/feedback",
]);

export default function RouteProtector() {
  const router = useRouter();
  const pathname = usePathname();


  useEffect(() => {
    const check = () => {
      if (PUBLIC_ROUTES.has(pathname)) return;

      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const token = appData?.accesstoken || null;

      if (!token && pathname !== "/login") {
        router.replace("/login");
      }
    };

    check();

  }, [router, pathname]);

  return null;
}
