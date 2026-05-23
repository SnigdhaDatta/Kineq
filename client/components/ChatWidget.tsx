"use client";
import dynamic from "next/dynamic";
import { BotMessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

const ChatWindow = dynamic(() => import("./ChatWindow"), { ssr: false });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const token = appData?.accesstoken || null;
      setAccessToken(token);
    };
    checkToken(); // checktoken function is called to set the initial state of accessToken when the component mounts
    window.addEventListener("authChanged", checkToken);

    return () => {
      window.removeEventListener("authChanged", checkToken);
    };
  }, []);

  if (!accessToken) return null;

  return (
    <>
      {!open && (
        <>
          <div
            className="fixed z-[9998] pointer-events-none float-soft"
            style={{
              bottom:
                "max(88px, calc(env(safe-area-inset-bottom, 16px) + 70px))",
              right: "16px",
              width: "min(120px, 40vw)", // ← এটা change করো
            }}
          >
            <div className="relative">
              {/* Subtle spread glow behind bubble */}
              <div className="glow-animate absolute -inset-[3px] rounded-2xl blur-[5px] opacity-60" />
              {/* Animated gradient border */}
              <div className="glow-animate relative rounded-2xl p-[1.5px]">
                {/* Inner bubble */}
                <div className="rounded-[14px] bg-white px-3 py-3">
                  <span className="block text-center font-mono text-[11px] font-bold tracking-wide text-black leading-snug">
                    Use me for recommendations
                  </span>
                </div>
              </div>
              {/* Tail */}
              <span className="absolute -bottom-[8px] right-5 h-4 w-4 rotate-45 bg-white border-r border-b border-gray-200" />
            </div>
          </div>
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
        </>
      )}
      {open && <ChatWindow setOpen={setOpen} />}
    </>
  );
}
