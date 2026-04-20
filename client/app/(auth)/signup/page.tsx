"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import PasswordInput from "@/components/password-input";
import RouteProtector from "@/middleware/routematcher";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFullNameValid = fullName.trim().length > 0;
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;
  const canSubmit = isFullNameValid && isEmailValid && isPasswordValid;

  function isStrongPassword(value: string) {
    const hasMinLength = value.length >= 8;
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
    return hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;
  }

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!canSubmit) {
      setError("Please fill all fields and satisfy all password conditions.");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a special character.",
      );
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ fullName, email, password, isVerified: false }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Signup failed");
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
      }
      setMessage("Login successful!");
      setTimeout(() => {
        router.push("/watchlist");
      }, 1200); // Show message for 1.2 seconds before redirect
    }
  }

  return (
    <form
      onSubmit={handleSignup}
      className="relative z-10 w-full max-w-md mx-auto mt-16 p-8 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_#000] flex flex-col gap-5"
    >
      <RouteProtector />
      {/* Header */}
      <div className="mb-2">
        <span className="inline-block font-mono text-xs tracking-[0.3em] uppercase bg-black text-white px-3 py-1 rounded-full mb-3">
          ✦ Join for free
        </span>
        <h2 className="text-3xl font-black tracking-tighter text-black leading-none">
          Sign Up
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

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500">
          Full Name
        </label>
        <input
          type="text"
          placeholder="Your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150"
        />
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

        {/*
        OTP verification UI removed for now:
        - Verify button beside email
        - OTP input field
        - OTP submit button
        - verification message
        - email verified status
        */}
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
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          <span
            className={`px-2 py-1 rounded-full border transition-all duration-200 ${hasMinLength ? "border-green-600 bg-green-50 text-green-700 scale-100" : "border-gray-300 bg-white text-gray-600 scale-[0.98]"}`}
          >
            {hasMinLength ? "✓" : "○"} Minimum 8+ characters
          </span>
          <span
            className={`px-2 py-1 rounded-full border transition-all duration-200 ${hasUppercase ? "border-green-600 bg-green-50 text-green-700 scale-100" : "border-gray-300 bg-white text-gray-600 scale-[0.98]"}`}
          >
            {hasUppercase ? "✓" : "○"} 1 Uppercase character
          </span>
          <span
            className={`px-2 py-1 rounded-full border transition-all duration-200 ${hasLowercase ? "border-green-600 bg-green-50 text-green-700 scale-100" : "border-gray-300 bg-white text-gray-600 scale-[0.98]"}`}
          >
            {hasLowercase ? "✓" : "○"} 1 Lowercase character
          </span>
          <span
            className={`px-2 py-1 rounded-full border transition-all duration-200 ${hasSpecialChar ? "border-green-600 bg-green-50 text-green-700 scale-100" : "border-gray-300 bg-white text-gray-600 scale-[0.98]"}`}
          >
            {hasSpecialChar ? "✓" : "○"} 1 Special character
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-white text-sm font-mono font-bold text-red-600">
          ⚠ {error}
        </div>
      )}
      {/* if message then show message in green success box */}
      {message && (
        <div className="flex items-center gap-2 px-4 py-3 bg-white text-sm font-mono font-bold text-green-600">
          ✅ {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 w-full flex items-center justify-center gap-2 bg-black text-white font-bold tracking-wide px-6 py-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#555] hover:shadow-[2px_2px_0px_#555] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#555] disabled:active:shadow-[4px_4px_0px_#555] disabled:active:translate-x-0 disabled:active:translate-y-0"
      >
        <UserPlus className="w-4 h-4" /> Get Started
      </button>

      <p className="text-center text-xs font-mono text-gray-400 tracking-widest">
        Kineq · FREE FOREVER
      </p>
    </form>
  );
}
