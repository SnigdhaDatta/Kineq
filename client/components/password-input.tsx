"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputId?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  className = "",
  inputId,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={inputId}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 pr-11 py-3 border-2 border-black rounded-xl bg-white font-mono text-sm text-black placeholder-gray-300 focus:outline-none focus:shadow-[3px_3px_0px_#000] transition-shadow duration-150 ${className}`}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
