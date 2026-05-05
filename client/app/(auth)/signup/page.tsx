"use client";
import { useState, useEffect, useRef } from "react";
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
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFullNameValid = fullName.trim().length > 0;
  const isPasswordValid =
    hasMinLength && hasUppercase && hasLowercase && hasSpecialChar;
  const canSubmit =
    isFullNameValid && isEmailValid && isPasswordValid && emailVerified;

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
      setError(
        "Please fill all fields, verify your email, and satisfy all password conditions.",
      );
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a special character.",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ fullName, email, password, isVerified: true }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
      } else {
        setMessage(data.message || "Signup successful!");
        const accessToken = res.headers?.get("Authorization");
        if (accessToken) {
          const appData = { accesstoken: accessToken };
          localStorage.setItem("kineq", JSON.stringify(appData));
          window.dispatchEvent(new Event("authChanged"));
        }
        setTimeout(() => {
          router.push("/watchlist");
        }, 1200);
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/sendOtp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send OTP.");
        setOtpSent(false);
        setOtpTimer(0);
      } else {
        setMessage(
          data.message ||
            "OTP sent to your email. If not in Inobx, please check your Spam folder.",
        );
        setOtpSent(true);
        setOtpTimer(120);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      setOtpSent(false);
      setOtpTimer(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      timerRef.current = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current!);
    } else if (!otpSent || otpTimer === 0) {
      clearInterval(timerRef.current!);
    }
    return () => clearInterval(timerRef.current!);
  }, [otpSent, otpTimer]);

  async function handleVerifyOtp(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!otp || otp.length < 4) {
      setError("Please enter the OTP sent to your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/verifyEmail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "OTP verification failed.");
        setEmailVerified(false);
      } else {
        setMessage(data.message || "Email verified successfully!");
        setEmailVerified(true);
        setOtpSent(false);
        setOtpTimer(0);
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.");
      setEmailVerified(false);
    } finally {
      setLoading(false);
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
          disabled={!emailVerified}
          className={`w-full px-4 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150 ${!emailVerified ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      </div>

      {/* Email + Verify Button */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono font-bold tracking-widest uppercase text-gray-500">
          Email
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailVerified(false);
              setOtpSent(false);
              setOtp("");
            }}
            required
            disabled={emailVerified}
            className={`flex-1 min-w-0 px-4 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150 ${emailVerified ? "opacity-60 cursor-not-allowed" : ""}`}
          />
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={
              emailVerified ||
              loading ||
              !isEmailValid ||
              (otpSent && otpTimer > 0)
            }
            className={`shrink-0 px-4 py-2 rounded-xl border-2 border-black font-mono text-xs font-bold uppercase tracking-widest bg-black text-white transition-all duration-150 ${emailVerified || loading || !isEmailValid || (otpSent && otpTimer > 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
          >
            {emailVerified
              ? "Verified"
              : otpSent && otpTimer > 0
                ? `Resend (${`0${Math.floor(otpTimer / 60)}`.slice(-2)}:${`0${otpTimer % 60}`.slice(-2)})`
                : otpSent
                  ? "Resend"
                  : "Verify"}
          </button>
        </div>

        {/* ✅ OTP section — input+button row, timer on its own row below */}
        {otpSent && !emailVerified && (
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 min-w-0 px-4 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150 disabled:opacity-50"
                maxLength={8}
                required
                disabled={otpTimer === 0}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || !otp || otpTimer === 0}
                className="shrink-0 px-4 py-2 rounded-xl border-2 border-black font-mono text-xs font-bold uppercase tracking-widest bg-black text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
            {/* Timer sits on its own row — never overflows */}
            <span
              suppressHydrationWarning={true}
              className={`text-center font-mono text-xs font-bold ${otpTimer === 0 ? "text-red-500" : "text-gray-500"}`}
            >
              {otpTimer > 0
                ? `OTP expires in ${`0${Math.floor(otpTimer / 60)}`.slice(-2)}:${`0${otpTimer % 60}`.slice(-2)}`
                : "OTP Expired — click Resend"}
            </span>
          </div>
        )}
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
          disabled={!emailVerified}
        />
        {/* ✅ 2-column grid — always side by side, fits any screen width */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
          <span
            className={`px-2 py-1 rounded-full border text-center transition-all duration-200 ${hasMinLength ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-600"}`}
          >
            {hasMinLength ? "✓" : "○"} Min 8 characters
          </span>
          <span
            className={`px-2 py-1 rounded-full border text-center transition-all duration-200 ${hasUppercase ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-600"}`}
          >
            {hasUppercase ? "✓" : "○"} 1 Uppercase
          </span>
          <span
            className={`px-2 py-1 rounded-full border text-center transition-all duration-200 ${hasLowercase ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-600"}`}
          >
            {hasLowercase ? "✓" : "○"} 1 Lowercase
          </span>
          <span
            className={`px-2 py-1 rounded-full border text-center transition-all duration-200 ${hasSpecialChar ? "border-green-600 bg-green-50 text-green-700" : "border-gray-300 bg-white text-gray-600"}`}
          >
            {hasSpecialChar ? "✓" : "○"} 1 Special char
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-white text-sm font-mono font-bold text-red-600">
          ⚠ {error}
        </div>
      )}
      {/* Success */}
      {message && (
        <div className="flex items-center gap-2 px-4 py-3 bg-white text-sm font-mono font-bold text-green-600">
          ✓ {message}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit || loading}
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
