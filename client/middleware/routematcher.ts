"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      router.replace("/signup");
    }
  }, [router]);

  return null; // This component doesn't render anything
}
