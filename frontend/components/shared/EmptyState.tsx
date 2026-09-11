"use client";

import React from "react";
import { Sprout } from "lucide-react";

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in my-4">
      <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-3xl text-emerald-600">
        {icon || <Sprout className="w-8 h-8" />}
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
