"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import PasswordInput from "@/components/password-input";
import RouteProtector from "@/middleware/routematcher";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", //for accessing httpOnly refresh token cookie
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === "User not found") {
        setError(data.error + "! Signup first to create an account");
        setTimeout(() => {
          router.push("/signup");
        }, 1200);
      }
      if (data.error === "REFRESH_EXPIRED") router.push("/login");
      setError(data.error || "Login failed");
    } else {
      setMessage(data.message || "Login successful!");
      const accessToken = res.headers?.get("Authorization");
      if (accessToken) {
        // Store all app data under 'kineq' key
        const appData = {
          accesstoken: accessToken, // key is 'accesstoken', value is the token
          // Add more properties here as needed (e.g., user info)
        };
        localStorage.setItem("kineq", JSON.stringify(appData));
        window.dispatchEvent(new Event("authChanged"));
      }
      setMessage("Login successful!");
      setTimeout(() => {
        router.push("/watchlist");
      }, 1200); // Show message for 1.2 seconds before redirect
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="relative z-10 w-full max-w-md mx-auto mt-16 p-8 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_#000] flex flex-col gap-5"
    >
      <RouteProtector />
      {/* Header */}
      <div className="mb-2">
        <span className="inline-block font-mono text-xs tracking-[0.3em] uppercase bg-black text-white px-3 py-1 rounded-full mb-3">
          ✦ Welcome back
        </span>
        <h2 className="text-3xl font-black tracking-tighter text-black leading-none">
          Login
        </h2>
        <svg className="mt-2" width="60" height="8" viewBox="0 0 60 8">
          <polyline
            points="0,6 8,2 16,6 24,2 32,6 40,2 48,6 56,2"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500">
          Password
        </label>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-white text-sm font-mono font-bold text-red-600">
          ⚠ {error}
        </div>
      )}

      {/* Success Message */}
      {message && !error && (
        <div className="flex items-center gap-2 px-4 py-3  bg-white text-green-600 text-sm font-mono font-bold">
          ✔ {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="mt-1 w-full flex items-center justify-center gap-2 bg-black text-white font-bold tracking-wide px-6 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[2px_2px_0px_#555] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
      >
        Login <ArrowUpRight className="w-4 h-4" />
      </button>

      <p className="text-center text-xs font-mono text-gray-400 tracking-widest">
        Kineq · FREE FOREVER
      </p>
      <div className="text-center flex flex-col gap-2">
        <span className="text-sm text-gray-600 font-mono">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-black font-bold hover:underline inline-flex items-center gap-1"
          >
            Sign Up <ArrowUpRight className="w-3 h-3" />
          </a>
        </span>
        <span className="text-sm text-gray-600 font-mono">
          <a
            href="/forget-password"
            className="text-black font-bold hover:underline inline-flex items-center gap-1"
          >
            Forgot Password? <ArrowUpRight className="w-3 h-3" />
          </a>
        </span>
      </div>
    </form>
  );
}
