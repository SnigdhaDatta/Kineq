"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";

declare global {
  interface Window {
    OneSignalDeferred?: Array<
      (OneSignal: {
        Notifications: {
          requestPermission: () => Promise<void>;
        };
      }) => void
    >;
  }
}

const DISMISS_KEY = "kineq-notification-prompt-dismissed";
const SHOW_PATH_PREFIXES = [
  "/watchlist",
  "/completed",
  "/ongoing",
];

export default function NotificationOptInPrompt() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    if (Notification.permission !== "default") return;

    const timer = window.setTimeout(() => setOpen(true), 8000);
    return () => window.clearTimeout(timer);
  }, []);

  //if the user navigates away from the relevant paths, close the prompt
  if (!SHOW_PATH_PREFIXES.some((prefix) => pathname?.startsWith(prefix))) {
    return null;
  }

  const dismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setOpen(false);
  };

  const enableNotifications = async () => {
    try {
      setLoading(true);

      if (window.OneSignalDeferred?.length) {
        window.OneSignalDeferred.push(async (OneSignal) => {
          await OneSignal.Notifications.requestPermission();
        });
      } else if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      dismiss();
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/25 backdrop-blur-[2px]"
      onClick={dismiss}
    >
      <div
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="rounded-3xl p-[1.5px] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
          <div className="rounded-3xl border-2 border-black bg-white px-4 py-4 text-black">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-[4px_4px_0px_#555]">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-black tracking-tight">
                  Turn on notifications?
                </p>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Get daily reminders, notifications, and updates.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={enableNotifications}
                    disabled={loading}
                    className="rounded-2xl bg-black px-4 py-2 text-sm font-bold text-white shadow-[4px_4px_0px_#555] transition-all duration-150 transform hover:translate-y-[1px] active:translate-y-[2px] hover:shadow-[2px_2px_0px_#444] active:shadow-[0px_0px_0px_#000] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Requesting..." : "Allow notifications"}
                  </button>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="rounded-2xl border-2 border-black bg-white px-4 py-2 text-sm font-bold text-black shadow-[4px_4px_0px_#bbb] transition-all duration-150 transform hover:translate-y-[1px] active:translate-y-[2px] hover:shadow-[2px_2px_0px_#999] active:shadow-[0px_0px_0px_#000]"
                  >
                    Not now
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close notification prompt"
                className="rounded-full p-1 text-gray-500 transition-colors hover:bg-black/5 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
