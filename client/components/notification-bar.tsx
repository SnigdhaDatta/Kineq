"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type NotificationType = "error" | "success" | "info";

interface NotificationBarProps {
  open: boolean;
  type: NotificationType;
  message: string;
  onClose: () => void;
  autoHideMs?: number;
}

export default function NotificationBar({
  open,
  type,
  message,
  onClose,
  autoHideMs = 2600,
}: NotificationBarProps) {
  useEffect(() => {
    if (!open || !message) return;
    const timer = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(timer);
  }, [open, message, autoHideMs, onClose]);

  if (!open || !message) return null;

  const variant = {
    error: {
      panel: "border-red-500 bg-white text-red-600",
      Icon: AlertCircle,
      role: "alert" as const,
    },
    success: {
      panel: "border-green-500 bg-white text-green-600",
      Icon: CheckCircle2,
      role: "status" as const,
    },
    info: {
      panel: "border-green-500 bg-white text-green-600",
      Icon: Info,
      role: "status" as const,
    },
  }[type];

  const Icon = variant.Icon;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-[360px] max-w-[calc(100vw-2rem)]">
      <div
        role={variant.role}
        className={`rounded-xl border-2 shadow-lg ${variant.panel}`}
      >
        <div className="flex items-start gap-3 p-3">
          <Icon className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm font-mono leading-5 flex-1">{message}</p>
          <button
            onClick={onClose}
            aria-label="Close notification"
            className="rounded p-1 hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
