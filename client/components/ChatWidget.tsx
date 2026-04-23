"use client";
import dynamic from "next/dynamic";
import { BotMessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

const ChatWindow = dynamic(() => import("./ChatWindow"), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
    const token = appData?.accesstoken || localStorage.getItem("accessToken");
    setAccessToken(token);
  }, []);

  if (!accessToken) return null;

  return (
    <>
      {!open && (
        <button
          aria-label="Open chat"
          className="fixed z-[9999] flex items-center gap-2 bg-black text-white rounded-full shadow-lg p-4 hover:bg-gray-900 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all duration-200"
          style={{
            maxWidth: "90vw",
            bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
            right: "16px",
            transform: "translate3d(0, 0, 0)",
            WebkitTransform: "translate3d(0, 0, 0)",
            WebkitAppearance: "none",
          }}
          onClick={() => setOpen(true)}
        >
          <BotMessageSquare size={30} />
        </button>
      )}
      {open && <ChatWindow setOpen={setOpen} />}
    </>
  );
}