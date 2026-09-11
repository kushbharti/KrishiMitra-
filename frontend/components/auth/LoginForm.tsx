"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wheat, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm({
  onSwitchToSignup,
}: {
  onSwitchToSignup: () => void;
}) {
  const { loginEmail, loginGoogle, user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<"FARMER" | "ADMIN">("FARMER");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectPath = (userRole?: string) => {
    const resolvedRole = userRole || role;
    if (resolvedRole === "ADMIN") return "/admin/dashboard";
    // Also check ?from= param for deep-link restoring
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (from && from.startsWith("/") && !from.startsWith("/admin")) return from;
    }
    return "/dashboard";
  };

  const handleAuthError = (err: any) => {
    console.error("[KrishiMitra UI] Auth Error:", err);
    if (err.code === "auth/invalid-credential") {
      setError("Invalid email or password.");
    } else if (err.code === "auth/popup-closed-by-user") {
      setError("Login cancelled. Popup closed.");
    } else if (err.code === "auth/cancelled-popup-request") {
      setError("Another authentication popup is already open.");
    } else {
      setError(err.message || "An unexpected error occurred.");
    }
    setIsLoading(false);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const loggedInUser = await loginEmail(email, password, role);
      setTimeout(() => {
        const resolvedRole = loggedInUser?.role || role;
        router.push(getRedirectPath(resolvedRole));
      }, 150);
    } catch (err: any) {
      handleAuthError(err);
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      const loggedInUser = await loginGoogle(role);
      setTimeout(() => {
        const resolvedRole = loggedInUser?.role || role;
        router.push(getRedirectPath(resolvedRole));
      }, 150);
    } catch (err: any) {
      handleAuthError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <h2 className="text-3xl font-extrabold text-white mb-5">Welcome Back</h2>

      {/* ── Animated Role Toggle ── */}
      <div className="mb-6 p-1 rounded-2xl bg-white/10 border border-white/15 flex relative">
        {/* Sliding indicator */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            role === "FARMER"
              ? "left-1 from-[#216869] to-[#49A078] shadow-lg shadow-[#49A078]/30"
              : "left-[calc(50%+3px)] from-[#475B63] to-[#2B2118] shadow-lg shadow-black/30"
          }`}
        />
        <button
          type="button"
          onClick={() => setRole("FARMER")}
          className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-colors duration-300 ${
            role === "FARMER" ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          <Wheat size={15} />
          <span>Farmer</span>
        </button>
        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className={`relative z-10 flex-1 py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-colors duration-300 ${
            role === "ADMIN" ? "text-white" : "text-white/50 hover:text-white/80"
          }`}
        >
          <ShieldCheck size={15} />
          <span>Admin</span>
        </button>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        {error && (
          <div className="p-3 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">EMAIL ADDRESS</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kisan@krishimitra.in"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#49A078] disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">PASSWORD</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#49A078] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-4 bg-[#49A078] hover:bg-[#3d8664] transition-colors text-white font-extrabold rounded-xl disabled:opacity-70 flex items-center justify-center"
        >
          {isLoading ? "Processing..." : "Secure Sign In"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full mt-4 py-3.5 bg-white hover:bg-gray-100 transition-colors text-slate-900 font-extrabold rounded-xl flex justify-center items-center gap-3 disabled:opacity-70"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <div className="mt-6 text-center text-sm text-slate-400">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          disabled={isLoading}
          className="text-[#49A078] font-bold hover:underline disabled:opacity-50"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}