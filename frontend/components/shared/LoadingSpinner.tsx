"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export default function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 animate-fade-in">
      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-inner">
        <Loader2 className={`${sizeClasses[size]} text-emerald-600 animate-spin`} />
      </div>
      <p className="text-xs sm:text-sm font-bold tracking-wide text-slate-500 animate-pulse">
        {text || t.common.loading}
      </p>
    </div>
  );
}