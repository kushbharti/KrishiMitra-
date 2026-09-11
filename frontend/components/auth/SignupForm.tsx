"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Wheat, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const { signupEmail, loginGoogle } = useAuth();
  const [role, setRole] = useState<"FARMER" | "ADMIN">("FARMER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRedirectPath = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      if (from && from.startsWith("/") && !from.startsWith("/admin")) return from;
    }
    return role === "ADMIN" ? "/admin" : "/dashboard";
  };

  const handleAuthError = (err: any) => {
    console.error("[KrishiMitra UI] Auth Error:", err);
    if (err.code === "auth/email-already-in-use")
      setError("Email is already in use.");
    else if (err.code === "auth/weak-password")
      setError("Password should be at least 6 characters.");
    else if (err.code === "auth/popup-closed-by-user")
      setError("Signup cancelled. Google popup closed.");
    else if (err.message?.includes("Network"))
      setError("Network error. Backend is unreachable.");
    else setError(err.message || "An unexpected error occurred.");
    setIsLoading(false);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      await signupEmail(fullName, email, password, role);
      const redirectUrl = getRedirectPath();
      window.location.href = redirectUrl;
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await loginGoogle();
      const redirectUrl = getRedirectPath();
      window.location.href = redirectUrl;
    } catch (err: any) {
      handleAuthError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto font-sans">
      <h2 className="text-3xl font-extrabold text-white mb-5">Create Account</h2>

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

      <form onSubmit={handleEmailSignup} className="space-y-4">
        {error && (
          <div className="p-3 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300">FULL NAME</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ram Singh"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#49A078] disabled:opacity-50"
          />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">CONFIRM</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#49A078] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 mt-4 bg-[#49A078] hover:bg-[#3d8664] transition-colors text-white font-extrabold rounded-xl flex items-center justify-center disabled:opacity-70"
        >
          {isLoading ? "Processing..." : "Register & Continue"}
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
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-[#49A078] font-bold hover:underline disabled:opacity-50"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
