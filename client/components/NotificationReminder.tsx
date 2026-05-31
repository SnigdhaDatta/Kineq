"use client";

import { useEffect, useState } from "react";
import { BellRing } from "lucide-react";

export default function NotificationReminder() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleAuthChanged = () => {
      try {
        const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
        const token = appData?.accesstoken || null;

        if (!token) {
          setVisible(false);
          return;
        }

        if (
          typeof Notification !== "undefined" &&
          Notification.permission === "granted"
        ) {
          setVisible(false);
          return;
        }

        try {
          const dismissed = sessionStorage.getItem(
            "kineq-notif-reminder-dismissed",
          );
          if (dismissed === "1") {
            setVisible(false);
            return;
          }
        } catch {}

        setVisible(true);
      } catch {
        setVisible(false);
      }
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => {
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);

  const dismiss = () => {
    try {
      sessionStorage.setItem("kineq-notif-reminder-dismissed", "1");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed md:w-11/12 w-9/12 left-4 right-4 bottom-6 z-[9999] flex items-center justify-between rounded-3xl border-2 border-black bg-white px-4 pr-10 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
      <button
        onClick={dismiss}
        aria-label="Close reminder"
        className="absolute top-2 right-3 rounded-full p-1 text-gray-500 hover:bg-black/5 hover:text-black"
      >
        ✕
      </button>

      <div className="flex items-center gap-3">
        <BellRing className="md:h-10 md:w-10 w-20 h-18 text-red-600" />
        <div className="text-sm text-gray-800">
          Please click the <strong>red bell</strong> icon to allow
          notifications. This will open your browser permission prompt.
        </div>
      </div>
    </div>
  );
}
