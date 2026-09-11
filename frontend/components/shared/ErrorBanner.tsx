"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4 text-red-900 flex items-center justify-between shadow-sm animate-fade-in mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <p className="text-sm font-semibold">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-xs font-bold text-red-600 hover:text-red-800 underline ml-4 flex-shrink-0"
        >
          {t.common.dismiss}
        </button>
      )}
    </div>
  );
}