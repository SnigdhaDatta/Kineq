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
    if (PUBLIC_ROUTES.has(pathname)) {
      return;
    }

    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const accessToken =
      appData?.accesstoken || localStorage.getItem("accessToken");
    if (!accessToken) {
      router.replace("/login");
    }
  }, [router, pathname]);

  return null; // This component doesn't render anything
}
