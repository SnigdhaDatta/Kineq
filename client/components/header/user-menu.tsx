"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LogIn, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function UserMenu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("watchlist");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  function isAccessTokenValid(storedToken?: string) {
    if (!storedToken || typeof storedToken !== "string") return false;

    const token = storedToken.startsWith("Bearer ")
      ? storedToken.split(" ")[1]
      : storedToken;

    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) return false;

      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "=",
      );

      const payload = JSON.parse(atob(padded));
      if (!payload?.exp) return false;
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncAuthAndTabState = () => {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const token = appData.accesstoken as string | undefined;
      const hasToken = typeof token === "string" && token.trim().length > 0;
      const validSession = isAccessTokenValid(token) || hasToken;

      setIsLoggedIn(validSession);

      const path = window.location.pathname;
      if (path.startsWith("/completed")) setCurrentTab("completed");
      else if (path.startsWith("/ongoing")) setCurrentTab("ongoing");
      else setCurrentTab("watchlist");

      if (!validSession) {
        setDropdownOpen(false);
      }
    };

    syncAuthAndTabState();
    const handleStorage = () => syncAuthAndTabState();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  function handleTabChange(tab: string) {
    setCurrentTab(tab);
    setDropdownOpen(false);
    router.push(`/${tab}`);
  }

  async function handleLogout() {
    try {
      const appData = JSON.parse(localStorage.getItem("kineq") || "{}");
      const accessToken = appData.accesstoken;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken || "",
        },
        credentials: "include",
      });
    } catch {
      // Ignore errors, proceed with logout
    }
    localStorage.removeItem("kineq");
    setIsLoggedIn(false);
    router.replace("/");
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Centered Tab Selector (only after login) */}
      {isLoggedIn && (
        <div className="relative" ref={dropdownRef}>
          <button
            className="w-[92px] sm:w-auto bg-white border-2 border-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-xl font-bold text-xs sm:text-base flex items-center gap-1 sm:gap-2 hover:bg-black hover:text-white transition-all duration-200 shadow-[2px_2px_0_0_rgba(0,0,0,0.9)] sm:min-w-[120px] justify-center"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="capitalize truncate max-w-[62px] sm:max-w-none">
              {currentTab}
            </span>
            <span
              className={`transition-transform ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
            >
              ▼
            </span>
          </button>
          {dropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border-2 border-black rounded-xl shadow-lg z-10">
              {["watchlist", "completed", "ongoing"]
                .filter((tab) => tab !== currentTab)
                .map((tab) => (
                  <div
                    key={tab}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                    onClick={() => handleTabChange(tab)}
                  >
                    {tab}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Login/Logout Button */}
      {isLoggedIn ? (
        <button
          className="bg-white border-2 border-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-xl font-bold text-xs sm:text-base hover:bg-black hover:text-white transition-all duration-200 shadow-[2px_2px_0_0_rgba(0,0,0,0.9)] inline-flex items-center gap-1 sm:gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4" /> Logout
        </button>
      ) : (
        <Link href="/login">
          <button className="bg-white border-2 border-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-xl font-bold text-xs sm:text-base hover:bg-black hover:text-white transition-all duration-200 shadow-[2px_2px_0_0_rgba(0,0,0,0.9)] inline-flex items-center gap-1 sm:gap-2">
            <LogIn className="w-3 h-3 sm:w-4 sm:h-4" /> Login
          </button>
        </Link>
      )}
    </div>
  );
}
